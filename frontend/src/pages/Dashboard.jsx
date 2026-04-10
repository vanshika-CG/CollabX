import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Lock } from 'lucide-react';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinPasscode, setJoinPasscode] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/rooms');
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms', error);
    }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post('http://localhost:5000/api/rooms', {
        name: newRoomName,
        isPrivate,
        passcode: isPrivate ? passcode : undefined
      }, config);
      navigate(`/room/${data._id}`);
    } catch (error) {
      console.error('Error creating room', error);
    }
  };

  const joinRoom = async (roomId) => {
     try {
         const token = localStorage.getItem('token');
         const config = { headers: { Authorization: `Bearer ${token}` } };
         await axios.post(`http://localhost:5000/api/rooms/${roomId}/join`, {}, config);
         navigate(`/room/${roomId}`);
     } catch(err) {
         console.log(err);
         alert(err.response?.data?.message || 'Error joining room');
     }
  };

  const submitJoinById = async (e) => {
      e.preventDefault();
      try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          await axios.post(`http://localhost:5000/api/rooms/${joinRoomId}/join`, { passcode: joinPasscode }, config);
          navigate(`/room/${joinRoomId}`);
      } catch(err) {
          console.log(err);
          alert(err.response?.data?.message || 'Error joining room. Invalid ID or Passcode.');
      }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
      <div className="glass-card" style={{ height: 'fit-content' }}>
        <h3>Create a Study Room</h3>
        <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Start a fresh session with your peers.</p>
        
        <form onSubmit={createRoom}>
          <div className="input-group">
            <label className="input-label">Room Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={newRoomName} 
              onChange={(e) => setNewRoomName(e.target.value)} 
              required 
            />
          </div>
          
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="private" 
              checked={isPrivate} 
              onChange={(e) => setIsPrivate(e.target.checked)} 
            />
            <label htmlFor="private">Private Room</label>
          </div>
          
          {isPrivate && (
            <div className="input-group">
              <label className="input-label">Passcode</label>
              <input 
                type="text" 
                className="input-field" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)} 
                required 
              />
            </div>
          )}
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Room</button>
        </form>

        <div style={{ margin: '2rem 0', height: '1px', background: 'var(--border-color)' }}></div>

        <h3>Join by ID</h3>
        <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Have a room code? Enter it below.</p>
        <form onSubmit={submitJoinById}>
          <div className="input-group">
            <label className="input-label">Room ID</label>
            <input 
              type="text" 
              className="input-field" 
              value={joinRoomId} 
              onChange={(e) => setJoinRoomId(e.target.value)} 
              required 
            />
          </div>
          {joinRoomId.length > 5 && (
            <div className="input-group">
                <label className="input-label">Passcode (if private)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={joinPasscode} 
                  onChange={(e) => setJoinPasscode(e.target.value)} 
                />
            </div>
          )}
          <button type="submit" className="btn btn-outline" style={{ width: '100%' }}>Join Room</button>
        </form>
      </div>

      <div>
        <h3>Public Active Rooms</h3>
        <p style={{ marginBottom: '1.5rem' }}>Join an existing session and start studying.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {rooms.map(room => (
            <div key={room._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {room.name}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Users size={16} /> {room.participants.length} Participant(s)
              </div>
              <p style={{ fontSize: '0.85rem' }}>Created by: {room.creator?.username}</p>
              
              <button 
                onClick={() => joinRoom(room._id)} 
                className="btn btn-outline" 
                style={{ marginTop: 'auto', width: '100%' }}
              >
                Join Room
              </button>
            </div>
          ))}
          {rooms.length === 0 && <p>No active public rooms at the moment.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
