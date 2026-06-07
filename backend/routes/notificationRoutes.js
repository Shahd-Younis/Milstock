const express = require('express');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  notificationRules,
  getNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
} = require('../controllers/notificationController');

const router = express.Router();

router.use(authenticate);

router.route('/').get(getNotifications).post(notificationRules, validate, createNotification);
router
  .route('/:id')
  .get(getNotification)
  .put(notificationRules, validate, updateNotification)
  .delete(deleteNotification);

module.exports = router;
