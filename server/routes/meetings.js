const express = require('express');
const router = express.Router();
const {
  getMeetings, getMeeting, createMeeting, updateMeeting, deleteMeeting,
  addAnnouncement,
} = require('../controllers/meetingController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roles');
const { validate, meetingSchema } = require('../validators');

router.get('/', protect, getMeetings);
router.get('/:id', protect, getMeeting);
router.post('/', protect, authorize('admin', 'member'), validate(meetingSchema), createMeeting);
router.put('/:id', protect, authorize('admin', 'member'), updateMeeting);
router.delete('/:id', protect, authorize('admin'), deleteMeeting);
router.post('/:id/announcements', protect, authorize('admin', 'member'), addAnnouncement);

module.exports = router;
