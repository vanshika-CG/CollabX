const express = require('express');
const { 
  createRoom, 
  getRooms, 
  joinRoom, 
  getRoom,
  leaveRoom,      // ← Added
  getMyRooms 
} = require('../controllers/roomController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, createRoom)
    .get(getRooms);

router.get('/my', protect, getMyRooms);
router.get('/:id', protect, getRoom);
router.post('/:id/join', protect, joinRoom);
router.post('/:id/leave', protect, leaveRoom);   // ← New route

module.exports = router;