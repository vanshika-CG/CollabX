const express = require('express');
const { getDecks, createDeck, submitQuizResult, getLeaderboard, generateQuizFromText } = require('../controllers/flashcardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getDecks)
  .post(protect, createDeck);

router.post('/quiz', protect, submitQuizResult);
router.post('/generate', protect, generateQuizFromText);
router.post('/generate-file', protect, require('../controllers/flashcardController').upload.single('file'), require('../controllers/flashcardController').generateQuizFromFile);
router.get('/leaderboard/:deckId', protect, getLeaderboard);

module.exports = router;
