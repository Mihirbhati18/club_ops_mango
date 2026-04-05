const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
exports.getEvents = async (req, res, next) => {
  try {
    const { status, type, date } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (date) filter.date = { $gte: new Date(date) };

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .populate('coordinators', 'name email')
      .populate('department', 'name')
      .sort({ date: -1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('coordinators', 'name email')
      .populate('department', 'name')
      .populate('registration.registered.user', 'name email')
      .populate('attendance', 'name email');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/events
exports.createEvent = async (req, res, next) => {
  try {
    req.body.organizer = req.user._id;
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check registration limit
    if (event.registration.limit > 0 && event.registration.registered.length >= event.registration.limit) {
      return res.status(400).json({ success: false, message: 'Registration limit reached' });
    }

    // Check deadline
    if (event.registration.deadline && new Date() > event.registration.deadline) {
      return res.status(400).json({ success: false, message: 'Registration deadline passed' });
    }

    // Check if already registered
    const isRegistered = event.registration.registered.some(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (isRegistered) {
      return res.status(400).json({ success: false, message: 'Already registered' });
    }

    event.registration.registered.push({ user: req.user._id });
    await event.save();
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// @desc    Add expense to event
// @route   POST /api/events/:id/expenses
exports.addExpense = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    event.expenses.push(req.body);
    await event.save();
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};
