const express = require('express');
const router = express.Router();
const {
  getEvents, getEvent, createEvent, updateEvent, deleteEvent,
  registerForEvent, addExpense,
} = require('../controllers/eventController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roles');
const { validate, eventSchema } = require('../validators');

router.get('/', protect, getEvents);
router.get('/:id', protect, getEvent);
router.post('/', protect, authorize('admin', 'member'), validate(eventSchema), createEvent);
router.put('/:id', protect, authorize('admin', 'member'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/expenses', protect, authorize('admin', 'member'), addExpense);

module.exports = router;
