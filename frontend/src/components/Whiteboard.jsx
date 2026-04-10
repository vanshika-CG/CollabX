import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Whiteboard = ({ roomId, isLocked, isCreator }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    const canvas = canvasRef.current;
    
    // Ensure CSS layout has painted before capturing offsetWidth
    const initCanvas = () => {
        canvas.width = canvas.parentElement.offsetWidth || 800;
        canvas.height = canvas.parentElement.offsetHeight || 500;

        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.strokeStyle = '#f8fafc';
        context.lineWidth = 3;
        contextRef.current = context;
        
        fetchState(context);
    };

    // Load persisted state
    const fetchState = async (context) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }};
            const { data } = await axios.get(`http://localhost:5000/api/whiteboard/${roomId}`, config);
            if (data && data.dataURL) {
                 const image = new Image();
                 image.onload = () => { context.drawImage(image, 0, 0); };
                 image.src = data.dataURL;
            }
        } catch(e) { console.error("Whiteboard load err", e) }
    }
    
    setTimeout(initCanvas, 100); // 100ms timeout for DOM paint
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('draw_receive', (data) => {
      const { x0, y0, x1, y1, color } = data;
      const context = contextRef.current;
      context.strokeStyle = color || '#f8fafc';
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.stroke();
      context.closePath();
      context.strokeStyle = '#f8fafc'; // Reset
    });

    socket.on('clear_whiteboard_receive', () => {
       const canvas = canvasRef.current;
       const context = contextRef.current;
       context.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off('draw_receive');
      socket.off('clear_whiteboard_receive');
    };
  }, [socket]);

  const startDrawing = ({ nativeEvent }) => {
    if (isLocked && !isCreator) {
        toast.error("Whiteboard is locked by the creator.");
        return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    if (socket) {
        socket.emit('save_whiteboard', { roomId, dataURL: canvasRef.current.toDataURL() });
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    
    // Get last position
    const x0 = contextRef.current.lastX || offsetX;
    const y0 = contextRef.current.lastY || offsetY;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    if (socket) {
        socket.emit('draw_event', {
            roomId,
            x0,
            y0,
            x1: offsetX,
            y1: offsetY,
        });
    }

    contextRef.current.lastX = offsetX;
    contextRef.current.lastY = offsetY;
  };
  
  const resetPosition = () => {
      contextRef.current.lastX = undefined;
      contextRef.current.lastY = undefined;
      finishDrawing();
  }

  const clearCanvas = () => {
      const canvas = canvasRef.current;
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
      if (socket) {
          socket.emit('clear_whiteboard', roomId);
      }
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>Shared Whiteboard</h4>
        <button onClick={clearCanvas} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }} title="Clear Canvas">
            <Trash2 size={16} />
        </button>
      </div>
      <div style={{ background: '#1e293b', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', height: '100%', minHeight: '500px', cursor: (isLocked && !isCreator) ? 'not-allowed' : 'crosshair' }}>
          <canvas
            onMouseDown={startDrawing}
            onMouseUp={resetPosition}
            onMouseOut={resetPosition}
            onMouseMove={draw}
            ref={canvasRef}
            style={{ touchAction: 'none', width: '100%', height: '100%' }}
          />
      </div>
    </div>
  );
};

export default Whiteboard;
