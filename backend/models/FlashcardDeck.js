const mongoose = require('mongoose');

const flashcardDeckSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cards: [{
    term: { type: String, required: true },
    definition: { type: String, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('FlashcardDeck', flashcardDeckSchema);
