const { body } = require('express-validator');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const Product = require('../models/productModel');
const { getAll, getOne, deleteOne } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { adjustStock } = require('../services/inventoryService');
const { createNotification } = require('../services/notificationService');

const orderRules = [
  body('total_price').optional().isFloat({ min: 0 }).withMessage('Total price must be 0 or greater'),
  body('status').optional().isIn(['pending', 'approved', 'completed', 'cancelled']).withMessage('Invalid order status'),
  body('user_id').optional().isMongoId().withMessage('Valid user_id is required'),
  body('supplier_id').optional().isMongoId().withMessage('Valid supplier_id is required'),
  body('items').optional().isArray().withMessage('Items must be an array'),
];

const orderPopulate = ['user_id', 'supplier_id'];

const createOrder = asyncHandler(async (req, res) => {
  const items = req.body.items || [];
  const total_price =
    req.body.total_price ??
    items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unit_price), 0);

  const order = await Order.create({
    date: req.body.date,
    total_price,
    status: req.body.status || 'pending',
    user_id: req.body.user_id || req.user._id,
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

  const populated = await Order.findById(order._id).populate(orderPopulate);
  res.status(201).json({ success: true, data: populated });
});

const updateOrder = asyncHandler(async (req, res) => {
  const before = await Order.findById(req.params.id);
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (before && order && before.status !== 'completed' && order.status === 'completed') {
    const items = await OrderItem.find({ order_id: order._id }).populate('product_id');

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (product) {
        await adjustStock({
          product_id: product._id,
          warehouse_id: product.warehouse_id,
          quantity: item.quantity,
          change_type: 'in',
          user_id: req.user._id,
          reference_type: 'order_completed',
        });
      }
    }
  }

  res.json({ success: true, data: order });
});

module.exports = {
  orderRules,
  getOrders: getAll(Order, orderPopulate),
  getOrder: getOne(Order, orderPopulate),
  createOrder,
  updateOrder,
  deleteOrder: deleteOne(Order),
};
