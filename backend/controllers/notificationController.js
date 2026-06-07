const { body } = require('express-validator');
const Notification = require('../models/notificationModel');
const { getAll, getOne, createOne, updateOne, deleteOne } = require('./crudFactory');

const notificationRules = [
  body('title').optional().trim().notEmpty().withMessage('Title is required'),
  body('type').optional().trim().notEmpty().withMessage('Type is required'),
  body('message').optional().trim().notEmpty().withMessage('Message is required'),
  body('is_read').optional().isBoolean().withMessage('is_read must be boolean'),
  body('user_id').optional().isMongoId().withMessage('Valid user_id is required'),
];

module.exports = {
  notificationRules,
  getNotifications: getAll(Notification, ['user_id']),
  getNotification: getOne(Notification, ['user_id']),
  createNotification: createOne(Notification),
  updateNotification: updateOne(Notification),
  deleteNotification: deleteOne(Notification),
};
