const FlashcardDeck = require('../models/FlashcardDeck');
const QuizResult = require('../models/QuizResult');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

const upload = multer({ storage: multer.memoryStorage() });

const getDecks = async (req, res) => {
  try {
    const decks = await FlashcardDeck.find().populate('creator', 'username');
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDeck = async (req, res) => {
  try {
    const { title, description, cards } = req.body;
    const deck = await FlashcardDeck.create({
      title,
      description,
      cards,
      creator: req.user._id
    });
    res.status(201).json(deck);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitQuizResult = async (req, res) => {
  try {
    const { deckId, score, totalCards } = req.body;
    const result = await QuizResult.create({
      user: req.user._id,
      deck: deckId,
      score,
      totalCards
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { deckId } = req.params;
    const results = await QuizResult.find({ deck: deckId })
      .sort({ score: -1 })
      .limit(10)
      .populate('user', 'username');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateQuizFromText = async (req, res) => {
    try {
        const { text, count } = req.body;
        const mcqCount = parseInt(count) || 5;
        
        // MOCK NLP GENERATION ALGORITHM
        // In a real app, this would ping OpenAI GPT-4 with a prompt: "Generate N MCQs from this text"
        const words = text.split(' ').filter(w => w.length > 5); // take long words
        const generatedCards = [];
        const limit = Math.min(mcqCount, Math.floor(words.length / 2));
        
        for(let i=0; i<limit; i++) {
            const answer = words[i * 2];
            generatedCards.push({
                question: `What is a related concept for contextual keyword "${answer.substring(0, 3)}..." found in the text?`,
                options: [
                    answer,
                    words[(i * 2 + 1) % words.length] || "Alpha",
                    "None of the above",
                    "All of the above"
                ].sort(() => Math.random() - 0.5), // shuffle options
                answer: answer
            });
        }
        
        if (generatedCards.length === 0) {
           return res.status(400).json({ message: "Text too short to generate quiz." });
        }

        res.json({ mcqs: generatedCards });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const generateQuizFromFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded." });
        
        const mimetype = req.file.mimetype;
        let extractedText = "";

        if (mimetype === 'application/pdf') {
            const data = await pdfParse(req.file.buffer);
            extractedText = data.text;
        } else if (mimetype.startsWith('image/')) {
            // Very heavy operation, runs OCR
            const result = await Tesseract.recognize(req.file.buffer, 'eng');
            extractedText = result.data.text;
        } else {
            return res.status(400).json({ message: "Unsupported file type. Please upload PDF or Image." });
        }

        // Apply our mock generator to the extracted text
        req.body.text = extractedText;
        req.body.count = req.body.count || 5;
        return generateQuizFromText(req, res);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to parse file: " + err.message });
    }
};

module.exports = { getDecks, createDeck, submitQuizResult, getLeaderboard, generateQuizFromText, generateQuizFromFile, upload };
