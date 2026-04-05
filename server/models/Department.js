const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['technical', 'non-technical'],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, default: 'member' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    tasks: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: {
          type: String,
          enum: ['pending', 'in-progress', 'completed'],
          default: 'pending',
        },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        dueDate: Date,
      },
    ],
    attendance: [
      {
        date: { type: Date, required: true },
        presentMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', departmentSchema);
