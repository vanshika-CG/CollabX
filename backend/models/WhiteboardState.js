const mongoose = require('mongoose');

const whiteboardStateSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
    unique: true
  },
  dataURL: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('WhiteboardState', whiteboardStateSchema);
