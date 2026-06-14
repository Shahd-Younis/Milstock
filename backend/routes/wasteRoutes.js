const express = require('express');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createWasteRules,
  createWaste,
  getWaste,
  getWasteAnalytics,
} = require('../controllers/wasteController');

const router = express.Router();

router.use(authenticate);

router.get('/analytics', getWasteAnalytics);
router.get('/', getWaste);
router.post('/', createWasteRules, validate, createWaste);

module.exports = router;
