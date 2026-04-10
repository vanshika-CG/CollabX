import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Trash2, Edit } from 'lucide-react';

const PersonalNotes = ({ roomId }) => {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchNotes();
    }, [roomId]);

    const fetchNotes = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }};
            const { data } = await axios.get(`http://localhost:5000/api/notes/${roomId}`, config);
            setNotes(data);
        } catch (err) {
            console.error(err);
        }
    };

    const addNote = async (e) => {
        e.preventDefault();
        if(!content.trim()) return;
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }};
            await axios.post(`http://localhost:5000/api/notes/${roomId}`, { content }, config);
            setContent('');
            fetchNotes();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNote = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }};
            await axios.delete(`http://localhost:5000/api/notes/item/${id}`, config);
            fetchNotes();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
            <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit size={16} /> Private Notes
            </h4>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {notes.map(n => (
                    <div key={n._id} style={{ background: 'var(--bg-surface-hover)', padding: '0.8rem', borderRadius: '8px', position: 'relative' }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', paddingRight: '2rem' }}>{n.content}</p>
                        <button onClick={() => deleteNote(n._id)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {notes.length === 0 && <p style={{ fontSize: '0.85rem' }}>No private notes for this room.</p>}
            </div>

            <form onSubmit={addNote} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <input 
                    type="text" 
                    className="input-field" 
                    style={{ flex: 1 }} 
                    placeholder="Jot something down..." 
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <button type="submit" className="btn btn-outline" style={{ padding: '0.5rem' }} title="Save Note">
                    <Save size={18} />
                </button>
            </form>
        </div>
    );
};

export default PersonalNotes;
