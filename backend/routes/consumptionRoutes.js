const express = require('express');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  consumptionRules,
  getConsumptions,
  getConsumption,
  createConsumption,
  updateConsumption,
  deleteConsumption,
} = require('../controllers/consumptionController');

const router = express.Router();

router.use(authenticate);

router.route('/').get(getConsumptions).post(consumptionRules, validate, createConsumption);
router
  .route('/:id')
  .get(getConsumption)
  .put(consumptionRules, validate, updateConsumption)
  .delete(deleteConsumption);

module.exports = router;
