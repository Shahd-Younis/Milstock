const { body } = require('express-validator');
const Supplier = require('../models/supplierModel');
const { getAll, getOne, createOne, updateOne, deleteOne } = require('./crudFactory');

const supplierRules = [
  body('name').optional().trim().isLength({ min: 3 }).withMessage('Supplier name is required'),
  body('phone').optional().trim().notEmpty().withMessage('Phone is required'),
];

module.exports = {
  supplierRules,
  getSuppliers: getAll(Supplier),
  getSupplier: getOne(Supplier),
  createSupplier: createOne(Supplier),
  updateSupplier: updateOne(Supplier),
  deleteSupplier: deleteOne(Supplier),
};
