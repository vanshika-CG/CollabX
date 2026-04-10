const express = require('express');
const WhiteboardState = require('../models/WhiteboardState');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:roomId', protect, async (req, res) => {
  try {
    const state = await WhiteboardState.findOne({ roomId: req.params.roomId });
    if(state) {
        res.json({ dataURL: state.dataURL });
    } else {
        res.status(404).json({ message: 'No state found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
