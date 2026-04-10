import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Home, Layers, Calendar, Shield, LogOut, User } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  
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
