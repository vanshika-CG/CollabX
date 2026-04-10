import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { Send } from 'lucide-react';

const ChatBox = ({ roomId, username }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }};
            const { data } = await axios.get(`http://localhost:5000/api/messages/${roomId}`, config);
            setMessages(data);
        } catch(err) { console.error('Failed to grab prev chat', err) }
    };
    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    const messageData = {
      id: Date.now(),
      roomId,
      username,
      text: inputText,
      isSystem: false,
      timestamp: new Date().toISOString()
    };

    socket.emit('send_message', messageData);
    setMessages((prev) => [...prev, messageData]);
    setInputText('');
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem', flex: 1 }}>
      <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Room Chat</h4>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {messages.map((msg, i) => (
          <div key={msg._id || msg.id || i} style={{ 
            alignSelf: msg.isSystem ? 'center' : (msg.username === username ? 'flex-end' : 'flex-start'),
            background: msg.isSystem ? 'transparent' : (msg.username === username ? 'var(--primary)' : 'var(--bg-surface)'),
            padding: msg.isSystem ? '0.2rem' : '0.5rem 0.8rem',
            borderRadius: msg.isSystem ? '0' : '8px',
            maxWidth: '90%',
            opacity: msg.isSystem ? 0.6 : 1,
            fontSize: msg.isSystem ? '0.8rem' : '0.9rem'
          }}>
            {!msg.isSystem && <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '0.2rem' }}>{msg.username}</div>}
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <input
          type="text"
          className="input-field"
          style={{ flex: 1 }}
          placeholder="Type..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
