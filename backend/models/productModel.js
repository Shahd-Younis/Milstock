const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
      enum: ['kg', 'g', 'liter', 'Tons', 'piece', 'box'],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    min_quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    warehouse_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    expiry_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
