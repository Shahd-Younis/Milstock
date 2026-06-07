const { body } = require('express-validator');
const Product = require('../models/productModel');
const ProductWarehouse = require('../models/productWarehouseModel');
const { getAll, getOne, deleteOne } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { adjustStock } = require('../services/inventoryService');

const productRules = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Product name is required'),
  body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be 0 or greater'),
  body('unit').optional().isIn(['kg', 'g', 'liter', 'Tons', 'piece', 'box']).withMessage('Invalid unit'),
  body('category').optional().trim().notEmpty().withMessage('Category is required'),
  body('min_quantity').optional().isFloat({ min: 0 }).withMessage('Minimum quantity must be 0 or greater'),
  body('warehouse_id').optional().isMongoId().withMessage('Valid warehouse_id is required'),
  body('expiry_date').optional({ nullable: true }).isISO8601().withMessage('Expiry date must be a valid date'),
];

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  await ProductWarehouse.create({
    product_id: product._id,
    warehouse_id: product.warehouse_id,
    quantity: 0,
  });

  if (product.quantity > 0 && req.user) {
    await adjustStock({
      product_id: product._id,
      warehouse_id: product.warehouse_id,
      quantity: product.quantity,
      change_type: 'in',
      user_id: req.user._id,
      reference_type: 'product_create',
    });
  }

  res.status(201).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const previous = await Product.findById(req.params.id);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (previous && product && req.body.quantity !== undefined) {
    const diff = Number(req.body.quantity) - previous.quantity;
    if (diff !== 0 && req.user) {
      await adjustStock({
        product_id: product._id,
        warehouse_id: product.warehouse_id,
        quantity: Math.abs(diff),
        change_type: diff > 0 ? 'in' : 'out',
        user_id: req.user._id,
        reference_type: 'product_update',
      });
    }
  }

  res.json({ success: true, data: product });
});

module.exports = {
  productRules,
  getProducts: getAll(Product, ['warehouse_id']),
  getProduct: getOne(Product, ['warehouse_id']),
  createProduct,
  updateProduct,
  deleteProduct: deleteOne(Product),
};
