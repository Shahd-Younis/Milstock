const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  productRules,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

router.use(authenticate);

router.route('/').get(getProducts).post(authorize('admin'), productRules, validate, createProduct);
router
  .route('/:id')
  .get(getProduct)
  .put(authorize('admin'), productRules, validate, updateProduct)
  .delete(authorize('admin'), deleteProduct);

module.exports = router;
