const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  supplierRules,
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController');

const router = express.Router();

router.use(authenticate);

router.route('/').get(getSuppliers).post(authorize('admin'), supplierRules, validate, createSupplier);
router
  .route('/:id')
  .get(getSupplier)
  .put(authorize('admin'), supplierRules, validate, updateSupplier)
  .delete(authorize('admin'), deleteSupplier);

module.exports = router;
