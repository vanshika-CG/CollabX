const express = require('express');
const { createRoom, getRooms, joinRoom, getRoom } = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, createRoom)
    .get(getRooms);

router.get('/:id', protect, getRoom);
router.post('/:id/join', protect, joinRoom);

module.exports = router;
