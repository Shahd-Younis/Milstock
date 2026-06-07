const Notification = require('../models/notificationModel');

const createNotification = (payload) => Notification.create(payload);

const createLowStockNotification = async (product, userId) => {
  if (product.quantity > product.min_quantity) return null;

  return createNotification({
    title: 'Low stock alert',
    type: 'low_stock',
    message: `${product.name} is at or below the minimum quantity.`,
    user_id: userId,
  });
};

module.exports = { createNotification, createLowStockNotification };
