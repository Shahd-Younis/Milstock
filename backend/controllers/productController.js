const { body } = require('express-validator');
const Product = require('../models/productModel');
const ProductWarehouse = require('../models/productWarehouseModel');
const Warehouse = require('../models/warehouseModel');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { adjustStock } = require('../services/inventoryService');
const { createAuditLog } = require('../services/auditLogService');
const { generateExpirationNotifications } = require('../services/expirationNotificationService');
const { buildWarehouseScopeFilter, assertWarehouseAccess } = require('../utils/warehouseScope');

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

const buildAlertSettingsResponse = (product) => ({
  product_id: product._id,
  product_name: product.name,
  unit: product.unit,
  low_stock_threshold: Number(product.alert_settings?.low_stock_threshold ?? product.min_quantity ?? 0),
  critical_stock_threshold: Number(product.alert_settings?.critical_stock_threshold ?? 0),
  expiration_warning_days: Number(product.alert_settings?.expiration_warning_days ?? 30),
  critical_expiration_days: Number(product.alert_settings?.critical_expiration_days ?? 7),
});

const alertSettingsRules = [
  body('low_stock_threshold').isFloat({ min: 0 }).withMessage('Low stock threshold must be 0 or greater'),
  body('critical_stock_threshold').isFloat({ min: 0 }).withMessage('Critical stock threshold must be 0 or greater'),
  body('expiration_warning_days').isFloat({ min: 0 }).withMessage('Expiration warning days must be 0 or greater'),
  body('critical_expiration_days').isFloat({ min: 0 }).withMessage('Critical expiration days must be 0 or greater'),
  body('critical_stock_threshold').custom((value, { req }) => {
    if (Number(value) > Number(req.body.low_stock_threshold)) {
      throw new Error('Critical stock threshold must be less than or equal to low stock threshold');
    }
    return true;
  }),
  body('critical_expiration_days').custom((value, { req }) => {
    if (Number(value) > Number(req.body.expiration_warning_days)) {
      throw new Error('Critical expiration days must be less than or equal to expiration warning days');
    }
    return true;
  }),
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

const getProductAlertSettings = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  res.json({ success: true, data: buildAlertSettingsResponse(product) });
});

const updateProductAlertSettings = asyncHandler(async (req, res) => {
  const previous = await Product.findById(req.params.id);
  if (!previous) {
    throw new AppError('Product not found', 404);
  }

  const alertSettings = {
    low_stock_threshold: Number(req.body.low_stock_threshold),
    critical_stock_threshold: Number(req.body.critical_stock_threshold),
    expiration_warning_days: Number(req.body.expiration_warning_days),
    critical_expiration_days: Number(req.body.critical_expiration_days),
  };

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { alert_settings: alertSettings },
    { new: true, runValidators: true }
  );

  await createAuditLog({
    req,
    action: 'update_product_alert_thresholds',
    module: 'settings',
    entityId: product._id,
    entityType: 'product',
    description: `Updated alert thresholds for ${product.name}`,
    previousData: { alert_settings: previous.alert_settings },
    newData: { alert_settings: product.alert_settings },
  });

  res.json({ success: true, data: buildAlertSettingsResponse(product) });
});

const attachWarehouseStock = async (products) => {
  const productList = Array.isArray(products) ? products : [products];
  const productIds = productList.map((product) => product._id);
  const stockRows = await ProductWarehouse.find({ product_id: { $in: productIds } })
    .populate('warehouse_id', '_id name code location status')
    .sort('-quantity');

  const rowsByProduct = stockRows.reduce((acc, row) => {
    const productId = String(row.product_id);
    if (!acc[productId]) acc[productId] = [];
    acc[productId].push(row);
    return acc;
  }, {});

  return productList.map((product) => {
    const plain = product.toObject ? product.toObject() : { ...product };
    const rows = rowsByProduct[String(product._id)] || [];
    const warehouses = rows
      .filter((row) => row.warehouse_id)
      .map((row) => ({
        id: String(row.warehouse_id._id),
        _id: row.warehouse_id._id,
        name: row.warehouse_id.name,
        code: row.warehouse_id.code,
        location: row.warehouse_id.location,
        status: row.warehouse_id.status,
        quantity: Number(row.quantity || 0),
        unit: plain.unit,
      }));

    if (!warehouses.length && plain.warehouse_id) {
      warehouses.push({
        id: String(plain.warehouse_id._id || plain.warehouse_id),
        _id: plain.warehouse_id._id || plain.warehouse_id,
        name: plain.warehouse_id.name || plain.warehouse_name || 'Unassigned',
        code: plain.warehouse_id.code || '',
        location: plain.warehouse_id.location || '',
        quantity: Number(plain.quantity || 0),
        unit: plain.unit,
      });
    }

    const totalStock = warehouses.reduce((sum, warehouse) => sum + Number(warehouse.quantity || 0), 0);
    return {
      ...plain,
      warehouses,
      totalStock,
      quantity: warehouses.length ? totalStock : Number(plain.quantity || 0),
    };
  });
};

const getProducts = asyncHandler(async (req, res) => {
  const scopeFilter = await buildWarehouseScopeFilter(req, Product);
  const queryFilter = { ...req.query };
  delete queryFilter.sort;
  delete queryFilter.limit;
  delete queryFilter.page;
  delete queryFilter.fields;

  const docs = await Product.find({ ...queryFilter, ...scopeFilter })
    .populate('warehouse_id')
    .sort('-createdAt');
  const data = await attachWarehouseStock(docs);

  res.json({ success: true, count: data.length, data });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('warehouse_id');
  if (!product) throw new AppError('Product not found', 404);
  await assertWarehouseAccess(req, Product, product);
  const [data] = await attachWarehouseStock(product);

  res.json({ success: true, data });
});

module.exports = {
  productRules,
  alertSettingsRules,
  getProducts,
  getProduct,
  getProductAlertSettings,
  updateProductAlertSettings,
  createProduct,
  updateProduct,
  deleteProduct,
};
