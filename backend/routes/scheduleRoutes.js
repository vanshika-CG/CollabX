const express = require('express');
const { getSchedules, createSchedule, deleteSchedule } = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getSchedules)
  .post(protect, createSchedule);

router.delete('/:id', protect, deleteSchedule);

module.exports = router;
