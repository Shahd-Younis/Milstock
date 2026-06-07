const mongoose = require('mongoose');

const inventoryMovementSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    change_type: {
      type: String,
      required: true,
      trim: true,
      enum: ['in', 'out'],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    reference_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
    },
    reference_type: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('InventoryMovement', inventoryMovementSchema);
