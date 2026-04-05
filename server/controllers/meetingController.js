const Meeting = require('../models/Meeting');

// @desc    Get all meetings
// @route   GET /api/meetings
exports.getMeetings = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const meetings = await Meeting.find(filter)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .populate('agenda.presenter', 'name')
      .sort({ date: -1 });
    res.status(200).json({ success: true, count: meetings.length, data: meetings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single meeting
// @route   GET /api/meetings/:id
exports.getMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .populate('agenda.presenter', 'name');
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }
    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    next(error);
  }
};

// @desc    Create meeting
// @route   POST /api/meetings
exports.createMeeting = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const meeting = await Meeting.create(req.body);
    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    next(error);
  }
};

// @desc    Update meeting
// @route   PUT /api/meetings/:id
exports.updateMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }
    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete meeting
// @route   DELETE /api/meetings/:id
exports.deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }
    res.status(200).json({ success: true, message: 'Meeting deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add announcement
// @route   POST /api/meetings/:id/announcements
exports.addAnnouncement = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }
    meeting.announcements.push(req.body);
    await meeting.save();
    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    next(error);
  }
};
