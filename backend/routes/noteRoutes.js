const express = require('express');
const { getNotes, saveNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:roomId').get(protect, getNotes).post(protect, saveNote);
router.route('/item/:id').delete(protect, deleteNote);

module.exports = router;
