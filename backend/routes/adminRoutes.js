const express = require('express');
const { getAllUsers, deleteUser, getAllRooms } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/users').get(protect, admin, getAllUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);
router.route('/rooms').get(protect, admin, getAllRooms);

module.exports = router;
