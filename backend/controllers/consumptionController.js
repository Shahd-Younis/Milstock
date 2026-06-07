const { body } = require('express-validator');
const Consumption = require('../models/consumptionModel');
const { getAll, getOne, deleteOne } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { adjustStock } = require('../services/inventoryService');

const consumptionRules = [
  body('user_id').optional().isMongoId().withMessage('Valid user_id is required'),
  body('product_id').optional().isMongoId().withMessage('Valid product_id is required'),
  body('warehouse_id').optional().isMongoId().withMessage('Valid warehouse_id is required'),
  body('quantity').optional().isFloat({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const createConsumption = asyncHandler(async (req, res) => {
  const consumption = await Consumption.create({
    ...req.body,
    user_id: req.body.user_id || req.user._id,
  });

  await adjustStock({
    product_id: consumption.product_id,
    warehouse_id: consumption.warehouse_id,
    quantity: consumption.quantity,
    change_type: 'out',
    user_id: consumption.user_id,
    reference_type: 'consumption',
  });

  res.status(201).json({ success: true, data: consumption });
});

module.exports = {
  consumptionRules,
  getConsumptions: getAll(Consumption, ['user_id', 'product_id', 'warehouse_id']),
  getConsumption: getOne(Consumption, ['user_id', 'product_id', 'warehouse_id']),
  createConsumption,
  updateConsumption: asyncHandler(async (_req, res) => {
    res.status(405).json({ success: false, message: 'Consumption records are immutable' });
  }),
  deleteConsumption: deleteOne(Consumption),
};
