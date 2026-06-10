const { body } = require('express-validator');
const Product = require('../models/productModel');
const ProductWarehouse = require('../models/productWarehouseModel');
const Warehouse = require('../models/warehouseModel');
const { getAll, getOne } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { adjustStock } = require('../services/inventoryService');
const { createAuditLog } = require('../services/auditLogService');
const { generateExpirationNotifications } = require('../services/expirationNotificationService');

const productRules = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Product name is required'),
  body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be 0 or greater'),
  body('unit').optional().isIn(['kg', 'g', 'liter', 'Tons', 'piece', 'box']).withMessage('Invalid unit'),
  body('category').optional().trim().notEmpty().withMessage('Category is required'),
  body('min_quantity').optional().isFloat({ min: 0 }).withMessage('Minimum quantity must be 0 or greater'),
  body('warehouse_id').optional().isMongoId().withMessage('Valid warehouse_id is required'),
  body('expiry_date').optional({ nullable: true }).isISO8601().withMessage('Expiry date must be a valid date'),
  body('expiration_date').optional({ nullable: true }).isISO8601().withMessage('Expiration date must be a valid date'),
  body('manufacturing_date').optional({ nullable: true }).isISO8601().withMessage('Manufacturing date must be a valid date'),
  body('warehouse_name').optional().trim(),
  body('storage_section').optional().trim(),
  body('batch_number').optional().trim(),
  body('serial_number').optional().trim(),
  body('description').optional().trim(),
  body('notes').optional().trim(),
];

const createProduct = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.expiration_date && !payload.expiry_date) {
    payload.expiry_date = payload.expiration_date;
  }
  if (payload.expiry_date && !payload.expiration_date) {
    payload.expiration_date = payload.expiry_date;
  }
  if (payload.warehouse_id && !payload.warehouse_name) {
    const warehouse = await Warehouse.findById(payload.warehouse_id);
    payload.warehouse_name = warehouse?.name || '';
  }

  const product = await Product.create(payload);

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

  await createAuditLog({
    req,
    action: 'create_item',
    module: 'inventory',
    entityId: product._id,
    entityType: 'Product',
    description: `Created inventory item ${product.name}`,
    newData: product,
  });
  await generateExpirationNotifications(req);

  res.status(201).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const previous = await Product.findById(req.params.id);
  const payload = { ...req.body };
  if (payload.expiration_date && !payload.expiry_date) {
    payload.expiry_date = payload.expiration_date;
  }
  if (payload.expiry_date && !payload.expiration_date) {
    payload.expiration_date = payload.expiry_date;
  }
  if (payload.warehouse_id && !payload.warehouse_name) {
    const warehouse = await Warehouse.findById(payload.warehouse_id);
    payload.warehouse_name = warehouse?.name || '';
  }

  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
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

  await createAuditLog({
    req,
    action: req.body.quantity !== undefined && previous?.quantity !== product?.quantity ? 'change_stock' : 'update_item',
    module: 'inventory',
    entityId: product?._id,
    entityType: 'Product',
    description: `Updated inventory item ${product?.name || req.params.id}`,
    previousData: previous,
    newData: product,
  });
  await generateExpirationNotifications(req);

  res.json({ success: true, data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  await createAuditLog({
    req,
    action: 'delete_item',
    module: 'inventory',
    entityId: product._id,
    entityType: 'Product',
    description: `Deleted inventory item ${product.name}`,
    previousData: product,
  });

  res.status(204).send();
});

module.exports = {
  productRules,
  getProducts: getAll(Product, ['warehouse_id']),
  getProduct: getOne(Product, ['warehouse_id']),
  createProduct,
  updateProduct,
  deleteProduct,
};
