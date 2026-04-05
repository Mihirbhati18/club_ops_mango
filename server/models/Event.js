const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    endDate: {
      type: Date,
    },
    time: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    onlineLink: {
      type: String,
      default: '',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coordinators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    registration: {
      limit: { type: Number, default: 0 },
      deadline: { type: Date },
      registered: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          registeredAt: { type: Date, default: Date.now },
        },
      ],
    },
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    poster: {
      type: String,
      default: '',
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    expenses: [
      {
        item: { type: String, required: true },
        amount: { type: Number, required: true },
        category: { type: String, default: 'general' },
      },
    ],
    approvalChecklist: {
      swcApproval: { type: Boolean, default: false },
      sponsorship: { type: Boolean, default: false },
      venueBooked: { type: Boolean, default: false },
      budgetApproved: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ['draft', 'upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'draft',
    },
    type: {
      type: String,
      enum: ['workshop', 'seminar', 'hackathon', 'meetup', 'competition', 'social', 'other'],
      default: 'other',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
