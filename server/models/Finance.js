const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['income', 'expense', 'sponsorship'],
      required: true,
    },
    category: {
      type: String,
      enum: ['event', 'sponsorship', 'membership', 'donation', 'equipment', 'venue', 'marketing', 'other'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    sponsor: {
      name: { type: String },
      contact: { type: String },
      type: { type: String, enum: ['active', 'passive', ''] },
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'cancelled'],
      default: 'pending',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receipt: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Finance', financeSchema);
