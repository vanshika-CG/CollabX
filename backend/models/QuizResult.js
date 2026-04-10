const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FlashcardDeck',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalCards: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);
