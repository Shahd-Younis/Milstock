const Notification = require('../models/notificationModel');

const createNotification = (payload) => Notification.create(payload);

const createLowStockNotification = async (product, userId) => {
  if (product.quantity > product.min_quantity) return null;
  const notificationKey = `low_stock:${product._id}`;

  const existing = await Notification.findOne({
    notification_key: notificationKey,
    status: 'unread',
  });

  if (existing) return existing;

  return createNotification({
    title: 'Low Stock Alert',
    type: 'low_stock',
    severity: 'warning',
    message: `The stock level for ${product.name} is below the configured minimum threshold.`,
    user_id: userId,
    item_id: product._id,
    entity_id: String(product._id),
    entity_type: 'item',
    status: 'unread',
    is_read: false,
    notification_key: notificationKey,
    metadata: {
      item_id: product._id,
      item_name: product.name,
      current_stock: product.quantity,
      minimum_stock: product.min_quantity,
      unit: product.unit,
    },
  });
};

module.exports = { createNotification, createLowStockNotification };
