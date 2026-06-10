const { body } = require('express-validator');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const OrderStatusLog = require('../models/OrderStatusLog');
const Product = require('../models/productModel');
const { getAll, getOne, deleteOne } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { adjustStock } = require('../services/inventoryService');
const { createNotification } = require('../services/notificationService');
const { createAuditLog } = require('../services/auditLogService');
const { assertWarehouseAccess, requireAssignedWarehouse } = require('../utils/warehouseScope');

const orderRules = [
  body('total_price').optional().isFloat({ min: 0 }).withMessage('Total price must be 0 or greater'),
  body('status').optional().isIn(['pending', 'approved', 'completed', 'cancelled']).withMessage('Invalid order status'),
  body('user_id').optional().isMongoId().withMessage('Valid user_id is required'),
  body('supplier_id').optional().isMongoId().withMessage('Valid supplier_id is required'),
  body('items').optional().isArray().withMessage('Items must be an array'),
];

const orderPopulate = ['user_id', 'supplier_id'];
const allowedStatuses = ['pending', 'approved', 'completed', 'cancelled'];
const allowedTransitions = {
  pending: ['approved', 'cancelled'],
  approved: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const statusAction = {
  approved: 'approved',
  cancelled: 'rejected',
  completed: 'delivered',
};

const applyCompletedOrderInventory = async ({ order, userId }) => {
  const items = await OrderItem.find({ order_id: order._id }).populate('product_id');

  for (const item of items) {
    const product = await Product.findById(item.product_id);
    if (product) {
      await adjustStock({
        product_id: product._id,
        warehouse_id: product.warehouse_id,
        quantity: item.quantity,
        change_type: 'in',
        user_id: userId,
        reference_type: 'order_completed',
      });
    }
  }
};

const createOrder = asyncHandler(async (req, res) => {
  const items = req.body.items || [];
  if (req.user?.role === 'unit') {
    const warehouseId = requireAssignedWarehouse(req);
    const productIds = items.map((item) => item.product_id).filter(Boolean);
    const matchingCount = await Product.countDocuments({ _id: { $in: productIds }, warehouse_id: warehouseId });
    if (matchingCount !== productIds.length) {
      throw new AppError('Unit users can only request products from their assigned warehouse', 403);
    }
  }
  const total_price =
    req.body.total_price ??
    items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unit_price), 0);

  const order = await Order.create({
    date: req.body.date,
    total_price,
    status: req.body.status || 'pending',
    user_id: req.user?.role === 'unit' ? req.user._id : req.body.user_id || req.user._id,
    supplier_id: req.body.supplier_id,
  });

  if (items.length) {
    await OrderItem.insertMany(
      items.map((item) => ({
        order_id: order._id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price ?? Number(item.quantity) * Number(item.unit_price),
      }))
    );
  }

  await createNotification({
    title: 'Order created',
    type: 'order',
    message: `Order ${order._id} was created with status ${order.status}.`,
    user_id: order.user_id,
  });

  await createAuditLog({
    req,
    action: 'create_request',
    module: 'requests',
    entityId: order._id,
    entityType: 'Order',
    description: `Created request ${order._id}`,
    newData: order,
  });

  const populated = await Order.findById(order._id).populate(orderPopulate);
  res.status(201).json({ success: true, data: populated });
});

const updateOrder = asyncHandler(async (req, res) => {
  const before = await Order.findById(req.params.id);
  if (!before) {
    throw new AppError('Order not found', 404);
  }
  await assertWarehouseAccess(req, Order, before);
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (before && order && before.status !== 'completed' && order.status === 'completed') {
    await applyCompletedOrderInventory({ order, userId: req.user._id });
  }

  if (before && order && before.status !== order.status) {
    await OrderStatusLog.create({
      order_id: order._id,
      previous_status: before.status,
      new_status: order.status,
      action: statusAction[order.status] || `status_changed_to_${order.status}`,
      changed_by: req.user?._id,
      note: req.body.note,
    });
  }

  await createAuditLog({
    req,
    action: before?.status !== order?.status ? 'status_transition' : 'update_request',
    module: 'requests',
    entityId: order?._id,
    entityType: 'Order',
    description: `Updated request ${order?._id}`,
    previousData: before,
    newData: order,
  });

  res.json({ success: true, data: order });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  if (!allowedStatuses.includes(status)) {
    throw new AppError(`Invalid order status. Allowed statuses: ${allowedStatuses.join(', ')}`, 400);
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  await assertWarehouseAccess(req, Order, order);

  const previousStatus = order.status;

  if (previousStatus === status) {
    const populated = await Order.findById(order._id).populate(orderPopulate);
    return res.json({
      success: true,
      data: populated,
      order: populated,
      log: null,
      message: `Order is already ${status}`,
    });
  }

  if (!allowedTransitions[previousStatus]?.includes(status)) {
    throw new AppError(`Cannot change order status from ${previousStatus} to ${status}`, 400);
  }

  order.status = status;
  await order.save();

  if (previousStatus !== 'completed' && status === 'completed') {
    await applyCompletedOrderInventory({ order, userId: req.user._id });
  }

  const log = await OrderStatusLog.create({
    order_id: order._id,
    previous_status: previousStatus,
    new_status: status,
    action: statusAction[status] || `status_changed_to_${status}`,
    changed_by: req.user?._id,
    note,
  });

  await createNotification({
    title: 'Order status updated',
    type: 'order',
    message: `Order ${order._id} changed from ${previousStatus} to ${status}.`,
    user_id: order.user_id,
  });

  await createAuditLog({
    req,
    action: statusAction[status] || `status_changed_to_${status}`,
    module: 'requests',
    entityId: order._id,
    entityType: 'Order',
    description: `Request ${order._id} changed from ${previousStatus} to ${status}`,
    previousData: { status: previousStatus },
    newData: { status },
  });

  const populated = await Order.findById(order._id).populate(orderPopulate);
  const populatedLog = await OrderStatusLog.findById(log._id).populate('changed_by');

  res.json({
    success: true,
    data: populated,
    order: populated,
    log: populatedLog,
  });
});

const getOrderStatusLogs = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  await assertWarehouseAccess(req, Order, order);

  const logs = await OrderStatusLog.find({ order_id: req.params.id })
    .populate('changed_by')
    .sort('-createdAt');

  res.json({ success: true, count: logs.length, data: logs, logs });
});

module.exports = {
  orderRules,
  getOrders: getAll(Order, orderPopulate),
  getOrder: getOne(Order, orderPopulate),
  createOrder,
  updateOrder,
  updateOrderStatus,
  getOrderStatusLogs,
  deleteOrder: deleteOne(Order),
};
