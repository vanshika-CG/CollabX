import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { useSocket } from '../context/SocketContext';
import { VideoOff, MicOff, Mic, Video, PhoneOff, MonitorUp } from 'lucide-react';

const VideoGrid = ({ roomId, onEndCall }) => {
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const socket = useSocket();
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    if (!socket) return;
    
    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
        setStream(currentStream);
        if (userVideo.current) {
            userVideo.current.srcObject = currentStream;
        }

        socket.emit('join_video', roomId);

        // When a new user joins, we (as an existing user) call them
        socket.on('user_connected_video', (socketId) => {
            const peer = createPeer(socketId, socket.id, currentStream);
            peersRef.current.push({
                peerID: socketId,
                peer,
            });
            setPeers((users) => [...users, { peerID: socketId, peer }]);
        });

        // When someone calls us, we answer
        socket.on('webrtc_offer_receive', (payload) => {
            console.log("Receiving offer from", payload.callerID);
            const peer = addPeer(payload.signal, payload.callerID, currentStream);
            peersRef.current.push({
                peerID: payload.callerID,
                peer,
            });
            setPeers((users) => {
                // prevent duplicates
                if(users.find(u => u.peerID === payload.callerID)) return users;
                return [...users, { peerID: payload.callerID, peer }];
            });
        });

        socket.on('webrtc_answer_receive', (payload) => {
            console.log("Receiving answer from", payload.id);
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            if (item) {
                item.peer.signal(payload.signal);
            }
        });

        socket.on('user_disconnected_video', (socketId) => {
           const peerObj = peersRef.current.find(p => p.peerID === socketId);
           if(peerObj) peerObj.peer.destroy();
           
           peersRef.current = peersRef.current.filter(p => p.peerID !== socketId);
           setPeers(peers => peers.filter(p => p.peerID !== socketId));
        });

    }).catch(err => console.log('Error accessing media devices.', err));

    return () => {
        if(stream) stream.getTracks().forEach(track => track.stop());
        socket.off('user_connected_video');
        socket.off('webrtc_offer_receive');
        socket.off('webrtc_answer_receive');
        socket.off('user_disconnected_video');
        peersRef.current.forEach(p => p.peer.destroy());
    }
  }, [socket, roomId]);

  function createPeer(userToSignal, callerID, stream) {
      const peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
          config: {
              iceServers: [
                  { urls: 'stun:stun.l.google.com:19302' },
                  { urls: 'stun:global.stun.twilio.com:3478' }
              ]
          }
      });

      peer.on('signal', signal => {
          socket.emit('webrtc_offer', { userToSignal, callerID, signal });
      });

      return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
      const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
          config: {
              iceServers: [
                  { urls: 'stun:stun.l.google.com:19302' },
                  { urls: 'stun:global.stun.twilio.com:3478' }
              ]
          }
      });

      peer.on('signal', signal => {
          socket.emit('webrtc_answer', { signal, callerID });
      });

      peer.signal(incomingSignal);

      return peer;
  }

  const toggleVideo = () => {
      if(stream) {
          stream.getVideoTracks()[0].enabled = !isVideoEnabled;
          setIsVideoEnabled(!isVideoEnabled);
      }
  }

  const toggleAudio = () => {
      if(stream) {
          stream.getAudioTracks()[0].enabled = !isAudioEnabled;
          setIsAudioEnabled(!isAudioEnabled);
      }
  }

  const toggleScreenShare = async () => {
      if (!isScreenSharing) {
          try {
              const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
              const screenTrack = screenStream.getVideoTracks()[0];
              const webcamTrack = stream.getVideoTracks()[0];
              
              screenTrack.onended = () => {
                  stopScreenShare();
              }

              peersRef.current.forEach(peerObj => {
                  peerObj.peer.replaceTrack(webcamTrack, screenTrack, stream);
              });

              userVideo.current.srcObject = screenStream;
              setIsScreenSharing(true);
          } catch(err) {
              console.log("Screen share failed", err);
          }
      } else {
          stopScreenShare();
      }
  }

  const stopScreenShare = () => {
      if(!userVideo.current.srcObject) return;
      
      const currentScreenTrack = userVideo.current.srcObject.getVideoTracks()[0];
      const webcamTrack = stream.getVideoTracks()[0];

      peersRef.current.forEach(peerObj => {
          peerObj.peer.replaceTrack(currentScreenTrack, webcamTrack, stream);
      });

      userVideo.current.srcObject = stream;
      setIsScreenSharing(false);
  }

  return (
    <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, maxHeight: '50vh' }}>
        <h4 style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Live Video Meeting
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                 <button className={`btn ${!isAudioEnabled ? 'btn-danger' : 'btn-outline'}`} style={{ padding: '0.5rem' }} onClick={toggleAudio} title="Toggle Audio">
                     {isAudioEnabled ? <Mic size={18}/> : <MicOff size={18} />}
                 </button>
                 <button className={`btn ${!isVideoEnabled ? 'btn-danger' : 'btn-outline'}`} style={{ padding: '0.5rem' }} onClick={toggleVideo} title="Toggle Video">
                     {isVideoEnabled ? <Video size={18}/> : <VideoOff size={18} />}
                 </button>
                 <button className={`btn ${isScreenSharing ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem' }} onClick={toggleScreenShare} title="Present Screen">
                     <MonitorUp size={18} />
                 </button>
                 <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={onEndCall} title="End Call">
                     <PhoneOff size={18} />
                 </button>
            </div>
        </h4>
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: peers.length > 0 ? 'repeat(auto-fit, minmax(250px, 1fr))' : '1fr', 
            gap: '1rem', 
            background: 'var(--bg-surface-hover)', 
            padding: '1rem', 
            borderRadius: '12px', 
            overflowY: 'auto',
            flex: 1
        }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '200px' }}>
                <video muted ref={userVideo} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', background: '#000', transform: 'scaleX(-1)' }} />
                <span style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>You</span>
            </div>
            
            {peers.map((peerObj) => {
                return (
                    <div key={peerObj.peerID} style={{ position: 'relative', width: '100%', height: '100%', minHeight: '200px' }}>
                        <VideoPeer peer={peerObj.peer} />
                        <span style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Member</span>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

const VideoPeer = ({ peer }) => {
    const ref = useRef();

    useEffect(() => {
        peer.on('stream', stream => {
            console.log("Got stream inside VideoPeer");
            if(ref.current) {
               ref.current.srcObject = stream;
               ref.current.play().catch(console.error);
            }
        });
    }, [peer]);

    return (
        <video playsInline autoPlay ref={ref} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', background: '#000' }} />
    );
};

export default VideoGrid;
