const User = require('../models/User');
const Room = require('../models/Room');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if(user.role === 'admin') {
          return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      await user.deleteOne();
      res.json({ message: 'User removed structurefully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRooms = async (req, res) => {
  try {
     const rooms = await Room.find({}).populate('creator', 'username email');
     res.json(rooms);
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, deleteUser, getAllRooms };
