const Room = require('../models/Room');

const createRoom = async (req, res) => {
  try {
    const { name, description, isPrivate, passcode } = req.body;
    
    // Validate passcode requirement for private rooms
    if (isPrivate && !passcode) {
        return res.status(400).json({ message: 'Private rooms require a passcode' });
    }

    const room = await Room.create({
      name,
      description,
      creator: req.user._id,
      participants: [req.user._id],
      isPrivate: isPrivate || false,
      passcode: isPrivate ? passcode : undefined
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false }).populate('creator', 'username email');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        if (room.isPrivate) {
            const { passcode } = req.body;
            if (room.passcode !== passcode) {
                return res.status(401).json({ message: 'Invalid passcode' });
            }
        }

        if (!room.participants.includes(req.user._id)) {
            room.participants.push(req.user._id);
            await room.save();
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createRoom, getRooms, getRoom, joinRoom };
