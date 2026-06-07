const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      enum: ['pending', 'approved', 'completed', 'cancelled'],
      default: 'pending',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
