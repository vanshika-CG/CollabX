const Note = require('../models/Note');

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id, roomId: req.params.roomId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveNote = async (req, res) => {
  try {
    const { content } = req.body;
    const note = await Note.create({
      user: req.user._id,
      roomId: req.params.roomId,
      content
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if(note.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized" });
        await note.deleteOne();
        res.json({ message: "Note removed" });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { getNotes, saveNote, deleteNote };
