import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar as CalIcon, Clock, Trash2, Plus } from 'lucide-react';

const Scheduler = () => {
    const [schedules, setSchedules] = useState([]);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const fetchSchedules = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }};
            const { data } = await axios.get('http://localhost:5000/api/schedule', config);
            setSchedules(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const addSchedule = async (e) => {
        e.preventDefault();
        
        // Prevent past dates and times
        const selectedDateTime = new Date(`${date}T${time}`);
        if (selectedDateTime < new Date()) {
            return alert("You cannot schedule a session in the past! Please select a future time.");
        }

        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }};
            await axios.post('http://localhost:5000/api/schedule', { title, date, time }, config);
            setTitle(''); setDate(''); setTime('');
            fetchSchedules();
        } catch (err) {
            alert('Error adding schedule');
        }
    };

    const deleteSchedule = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }};
            await axios.delete(`http://localhost:5000/api/schedule/${id}`, config);
            fetchSchedules();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem' }}>
            <div className="glass-card">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CalIcon /> Upcoming Study Sessions
                </h3>
                
                {schedules.length === 0 && <p>No scheduled sessions. Add one!</p>}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {schedules.map(s => (
                        <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <div>
                                <h4 style={{ margin: 0 }}>{s.title}</h4>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><CalIcon size={14}/> {s.date}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={14}/> {s.time}</span>
                                </div>
                            </div>
                            <button className="btn btn-outline" onClick={() => deleteSchedule(s._id)} style={{ padding: '0.4rem', border: 'none', color: 'var(--danger)' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card" style={{ height: 'fit-content' }}>
                <h3>Schedule New Session</h3>
                <form onSubmit={addSchedule} style={{ marginTop: '1.5rem' }}>
                    <div className="input-group">
                        <label className="input-label">Topic / Title</label>
                        <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Date</label>
                        <input 
                            type="date" 
                            className="input-field" 
                            value={date} 
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => setDate(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Time</label>
                        <input 
                            type="time" 
                            className="input-field" 
                            value={time} 
                            onChange={e => setTime(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                        <Plus size={16} /> Add to Schedule
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Scheduler;
