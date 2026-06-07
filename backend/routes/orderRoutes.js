const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  orderRules,
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

router.use(authenticate);

router.route('/').get(getOrders).post(orderRules, validate, createOrder);
router
  .route('/:id')
  .get(getOrder)
  .put(authorize('admin'), orderRules, validate, updateOrder)
  .delete(authorize('admin'), deleteOrder);

module.exports = router;
