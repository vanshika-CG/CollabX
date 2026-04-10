import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ChatBox from '../components/ChatBox';
import Whiteboard from '../components/Whiteboard';
import PomodoroTimer from '../components/PomodoroTimer';
import VideoGrid from '../components/VideoGrid';
import PersonalNotes from '../components/PersonalNotes';
import { ArrowLeft, Video, VideoOff, Lock, Unlock } from 'lucide-react';

const StudyRoom = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isWhiteboardLocked, setIsWhiteboardLocked] = useState(false);
  const [roomData, setRoomData] = useState(null);
  
  const isCreator = roomData && (String(user._id) === String(roomData.creator._id || roomData.creator) || user.role === 'admin');
  
  // Video Call State
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    // Fetch room to know the creator
    fetch(`http://localhost:5000/api/rooms/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(async res => {
            if(!res.ok) throw new Error("Room fetch failed");
            return res.json();
        })
        .then(data => setRoomData(data))
        .catch(console.error);

    if (socket && user) {
      socket.emit('join_room', { roomId: id, username: user.username });
      
      socket.on('recording_status', (data) => {
          setIsRecording(data.isRecording);
      });
      
      socket.on('whiteboard_lock_status', (status) => {
          setIsWhiteboardLocked(status);
      });
      
      socket.on('incoming_video_call', (callerName) => {
          setIncomingCall(callerName);
      });
      
      socket.on('admin_end_call_receive', () => {
          setIsVideoCallActive(false);
      });
    }
    
    return () => {
        if (socket && user) {
            socket.emit('disconnect_from_room', { roomId: id, username: user.username });
            socket.off('recording_status');
            socket.off('whiteboard_lock_status');
            socket.off('incoming_video_call');
            socket.off('admin_end_call_receive');
        }
    }
  }, [socket, user, id]);

  const toggleRecording = () => {
      const newState = !isRecording;
      setIsRecording(newState);
      if (socket) {
          socket.emit('recording_started', { roomId: id, isRecording: newState });
      }
  };

  const toggleWhiteboardLock = () => {
      // Typically restrict to admin/creator
      if (user._id !== roomData?.creator && user.role !== 'admin') return;
      
      const newState = !isWhiteboardLocked;
      setIsWhiteboardLocked(newState);
      if (socket) {
          socket.emit('whiteboard_toggle_lock', { roomId: id, isLocked: newState });
      }
  };

  const requestVideoCall = () => {
      setIsVideoCallActive(true);
      if(socket) {
          socket.emit('start_video_call', { roomId: id, callerName: user.username });
      }
  };

  const handleEndCall = () => {
      setIsVideoCallActive(false);
      if (user._id === roomData?.creator || user.role === 'admin') {
          socket.emit('admin_end_call', id);
      }
  };

  if (!socket) return <div style={{ padding: '2rem' }}>Connecting to real-time sync...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexShrink: 0 }}>
        <button className="btn btn-outline" onClick={() => navigate('/')} style={{ padding: '0.4rem 0.8rem' }}>
            <ArrowLeft size={16} /> Back
        </button>
        <h2 style={{ margin: 0 }}>Study Room ({id})</h2>
        
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isRecording && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span className="pulse-indicator"></span> Recording Session</span>}
            
            {isCreator && (
                <button className={`btn ${isWhiteboardLocked ? 'btn-danger' : 'btn-outline'}`} onClick={toggleWhiteboardLock}>
                    {isWhiteboardLocked ? <Lock size={16} /> : <Unlock size={16} />} 
                    {isWhiteboardLocked ? 'Board Locked' : 'Lock Board'}
                </button>
            )}

            {!isVideoCallActive && (
                <button className="btn btn-primary" onClick={requestVideoCall}>
                    <Video size={16} /> Start Video Call
                </button>
            )}

            <button className={`btn ${isRecording ? 'btn-danger' : 'btn-outline'}`} onClick={toggleRecording}>
                {isRecording ? <VideoOff size={16} /> : <Video size={16} />} 
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
        </div>
      </div>

      {incomingCall && !isVideoCallActive && (
          <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', borderColor: 'var(--primary)', marginBottom: '1.5rem', padding: '1rem' }}>
              <span style={{ fontWeight: 600 }}>📞 {incomingCall} is starting a video call...</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={() => { setIsVideoCallActive(true); setIncomingCall(null); }}>Accept</button>
                  <button className="btn btn-danger" onClick={() => setIncomingCall(null)}>Decline</button>
              </div>
          </div>
      )}

      {/* Grid refactored: 3 columns if screen large, left heavy for board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px 300px', gap: '1.5rem', flex: 1, minHeight: 0, height: 'calc(100vh - 160px)' }}>
        
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 0, height: '100%' }}>
            {isVideoCallActive && <VideoGrid roomId={id} onEndCall={handleEndCall} />}
            <div style={{ position: 'relative', flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
               {isWhiteboardLocked && <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.3)', pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', border: '2px dashed var(--danger)' }}></div>}
               {roomData ? <Whiteboard roomId={id} isLocked={isWhiteboardLocked} isCreator={isCreator} /> : <div className="glass-card" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Whiteboard...</div>}
            </div>
        </div>
        
        {/* Chat Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 0 }}>
            <ChatBox roomId={id} username={user.username} />
        </div>

        {/* Tools Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 0 }}>
            <PomodoroTimer roomId={id} />
            <PersonalNotes roomId={id} />
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
