const { body } = require('express-validator');
const Warehouse = require('../models/warehouseModel');
const { getAll, getOne, createOne, updateOne, deleteOne } = require('./crudFactory');

const warehouseRules = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Warehouse name is required'),
  body('location').optional().trim().notEmpty().withMessage('Location is required'),
  body('user_id').optional().isMongoId().withMessage('Valid user_id is required'),
];

module.exports = {
  warehouseRules,
  getWarehouses: getAll(Warehouse, ['user_id']),
  getWarehouse: getOne(Warehouse, ['user_id']),
  createWarehouse: createOne(Warehouse),
  updateWarehouse: updateOne(Warehouse),
  deleteWarehouse: deleteOne(Warehouse),
};
