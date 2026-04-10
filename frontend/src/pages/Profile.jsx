import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { UserCircle, Mail, Key } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ joinedRooms: 0, createdRooms: 0, avgScore: 0 });

    useEffect(() => {
        // Mocking user stats grab - could build a dedicated stats route later
        setStats({
            joinedRooms: Math.floor(Math.random() * 10),
            createdRooms: Math.floor(Math.random() * 5),
            avgScore: Math.floor(Math.random() * 100)
        });
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem' }}>Student Profile</h2>
            
            <div className="glass-card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '2rem', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <UserCircle size={64} />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user.username}</h3>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Mail size={16} /> {user.email}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Key size={16} /> Role: <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{user.role}</span></p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)' }}>Created Rooms</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.createdRooms}</p>
                </div>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)' }}>Joined Rooms</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>{stats.joinedRooms}</p>
                </div>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--text-muted)' }}>Global Quiz Avg</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>{stats.avgScore}%</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
