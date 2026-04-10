import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';

const Topbar = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.username}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user.role === 'admin' ? 'Administrator' : 'Student'}</div>
        </div>
        <UserCircle size={36} color="var(--text-muted)" />
      </div>
    </div>
  );
};

export default Topbar;
