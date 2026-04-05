const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Meeting title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Meeting date is required'],
    },
    time: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      default: '',
    },
    onlineLink: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['general', 'department', 'emergency', 'review'],
      default: 'general',
    },
    agenda: [
      {
        topic: { type: String, required: true },
        duration: { type: Number, default: 15 },
        presenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    minutes: {
      type: String,
      default: '',
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    announcements: [
      {
        content: { type: String, required: true },
        priority: {
          type: String,
          enum: ['low', 'medium', 'high'],
          default: 'medium',
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meeting', meetingSchema);
