const Schedule = require('../models/Schedule');

const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ user: req.user._id }).sort({ date: 1, time: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSchedule = async (req, res) => {
  try {
    const { title, date, time, durationMinutes } = req.body;
    const schedule = await Schedule.create({
      user: req.user._id,
      title,
      date,
      time,
      durationMinutes
    });
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    if (schedule.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await schedule.deleteOne();
    res.json({ message: 'Schedule removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSchedules, createSchedule, deleteSchedule };
