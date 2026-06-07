const { body } = require('express-validator');
const InventoryMovement = require('../models/inventoryMovementModel');
const { getAll, getOne, createOne, updateOne, deleteOne } = require('./crudFactory');

const inventoryMovementRules = [
  body('user_id').optional().isMongoId().withMessage('Valid user_id is required'),
  body('product_id').optional().isMongoId().withMessage('Valid product_id is required'),
  body('change_type').optional().isIn(['in', 'out']).withMessage('Change type must be in or out'),
  body('stock').optional().isFloat({ min: 0 }).withMessage('Stock must be 0 or greater'),
  body('reference_id').optional().isMongoId().withMessage('Valid reference_id is required'),
  body('reference_type').optional().trim(),
];

module.exports = {
  inventoryMovementRules,
  getInventoryMovements: getAll(InventoryMovement, ['user_id', 'product_id', 'reference_id']),
  getInventoryMovement: getOne(InventoryMovement, ['user_id', 'product_id', 'reference_id']),
  createInventoryMovement: createOne(InventoryMovement),
  updateInventoryMovement: updateOne(InventoryMovement),
  deleteInventoryMovement: deleteOne(InventoryMovement),
};
