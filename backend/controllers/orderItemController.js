const { body } = require('express-validator');
const OrderItem = require('../models/orderItemModel');
const Order = require('../models/orderModel');
const { getAll, getOne, deleteOne } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');

const orderItemRules = [
  body('order_id').optional().isMongoId().withMessage('Valid order_id is required'),
  body('product_id').optional().isMongoId().withMessage('Valid product_id is required'),
  body('quantity').optional().isFloat({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('unit_price').optional().isFloat({ min: 0 }).withMessage('Unit price must be 0 or greater'),
  body('total_price').optional().isFloat({ min: 0 }).withMessage('Total price must be 0 or greater'),
];

const recalculateOrderTotal = async (orderId) => {
  const items = await OrderItem.find({ order_id: orderId });
  const total_price = items.reduce((sum, item) => sum + item.total_price, 0);
  await Order.findByIdAndUpdate(orderId, { total_price }, { runValidators: true });
};

const createOrderItem = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    total_price: req.body.total_price ?? Number(req.body.quantity) * Number(req.body.unit_price),
  };
  const item = await OrderItem.create(payload);
  await recalculateOrderTotal(item.order_id);
  res.status(201).json({ success: true, data: item });
});

const updateOrderItem = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.quantity !== undefined || payload.unit_price !== undefined) {
    const existing = await OrderItem.findById(req.params.id);
    const quantity = payload.quantity ?? existing.quantity;
    const unit_price = payload.unit_price ?? existing.unit_price;
    payload.total_price = payload.total_price ?? Number(quantity) * Number(unit_price);
  }

  const item = await OrderItem.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  await recalculateOrderTotal(item.order_id);
  res.json({ success: true, data: item });
});

module.exports = {
  orderItemRules,
  getOrderItems: getAll(OrderItem, ['order_id', 'product_id']),
  getOrderItem: getOne(OrderItem, ['order_id', 'product_id']),
  createOrderItem,
  updateOrderItem,
  deleteOrderItem: deleteOne(OrderItem),
};
