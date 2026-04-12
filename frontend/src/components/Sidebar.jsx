import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Home, Layers, Calendar, Shield, LogOut, User, MessageSquare, Palette, Timer, StickyNote } from 'lucide-react';
import axios from 'axios';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/rooms', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleFeatureClick = (feature) => {
    if (rooms.length === 0) {
      alert('Please create or join a room first');
      navigate('/');
      return;
    }
    navigate(`/room/${rooms[0]._id}/${feature}`);
  };
  
  if (!user) return null; // Don't show sidebar on login/register

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <BookOpen size={24} color="var(--primary)" />
        CollabX
      </div>
      
      <div className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} /> Dashboard
        </NavLink>
        
        {/* Study Room Features */}
        <div style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            Study Room Features
          </div>
        </div>
        
        <button 
          onClick={() => handleFeatureClick('chat')}
          className="nav-item"
          style={{ 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer', 
            margin: 0,
            textAlign: 'left',
            padding: '0.75rem 1rem',
            width: '100%'
          }}
        >
          <MessageSquare size={20} /> Chat
        </button>
        
        <button 
          onClick={() => handleFeatureClick('whiteboard')}
          className="nav-item"
          style={{ 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer', 
            margin: 0,
            textAlign: 'left',
            padding: '0.75rem 1rem',
            width: '100%'
          }}
        >
          <Palette size={20} /> Whiteboard
        </button>
        
        <button 
          onClick={() => handleFeatureClick('timer')}
          className="nav-item"
          style={{ 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer', 
            margin: 0,
            textAlign: 'left',
            padding: '0.75rem 1rem',
            width: '100%'
          }}
        >
          <Timer size={20} /> Pomodoro Timer
        </button>
        
        <button 
          onClick={() => handleFeatureClick('notes')}
          className="nav-item"
          style={{ 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer', 
            margin: 0,
            textAlign: 'left',
            padding: '0.75rem 1rem',
            width: '100%'
          }}
        >
          <StickyNote size={20} /> Notes
        </button>
        
        <NavLink to="/flashcards" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Layers size={20} /> Flashcards & Quizzes
        </NavLink>
        
        <NavLink to="/scheduler" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar size={20} /> Study Scheduler
        </NavLink>
        
        <NavLink to="/profile" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={20} /> Student Profile
        </NavLink>
        
        {user.role === 'admin' && (
          <NavLink to="/admin" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Shield size={20} /> Admin Panel
          </NavLink>
        )}
      </div>

      <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <button onClick={logout} className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', margin: 0 }}>
          <LogOut size={20} /> Logout Account
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
