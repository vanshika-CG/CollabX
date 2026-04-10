import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { Play, Pause, RotateCcw } from 'lucide-react';

const PomodoroTimer = ({ roomId }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // pomodoro, shortBreak
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_timer_update', (data) => {
      setTimeLeft(data.timeLeft);
      setIsActive(data.isActive);
      setMode(data.mode);
    });

    return () => socket.off('receive_timer_update');
  }, [socket]);

  useEffect(() => {
      let interval = null;
      if (isActive && timeLeft > 0) {
          interval = setInterval(() => {
              setTimeLeft(timeLeft => timeLeft - 1);
          }, 1000);
      } else if (timeLeft === 0) {
          setIsActive(false);
          // Auto switch mode logic could go here
      }
      return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const broadcastState = (newState) => {
      if (socket) {
          socket.emit('timer_update', { roomId, ...newState });
      }
  }

  const toggleTimer = () => {
    const newState = { timeLeft, isActive: !isActive, mode };
    setIsActive(!isActive);
    broadcastState(newState);
  };

  const resetTimer = () => {
    const newTime = mode === 'pomodoro' ? 25 * 60 : 5 * 60;
    const newState = { timeLeft: newTime, isActive: false, mode };
    setTimeLeft(newTime);
    setIsActive(false);
    broadcastState(newState);
  };

  const switchMode = (newMode) => {
    const newTime = newMode === 'pomodoro' ? 25 * 60 : 5 * 60;
    const newState = { timeLeft: newTime, isActive: false, mode: newMode };
    setMode(newMode);
    setTimeLeft(newTime);
    setIsActive(false);
    broadcastState(newState);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <button 
            className={`btn ${mode === 'pomodoro' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
            onClick={() => switchMode('pomodoro')}
          >
            Pomodoro
          </button>
          <button 
            className={`btn ${mode === 'shortBreak' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
            onClick={() => switchMode('shortBreak')}
          >
            Break
          </button>
      </div>

      <div style={{ fontSize: '3.5rem', fontWeight: 700, margin: '1rem 0', fontFamily: 'monospace' }}>
        {formatTime(timeLeft)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button onClick={toggleTimer} className="btn btn-outline" style={{ width: '50px', height: '50px', borderRadius: '50%', padding: 0 }}>
          {isActive ? <Pause /> : <Play />}
        </button>
        <button onClick={resetTimer} className="btn btn-outline" style={{ width: '50px', height: '50px', borderRadius: '50%', padding: 0 }}>
          <RotateCcw />
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
