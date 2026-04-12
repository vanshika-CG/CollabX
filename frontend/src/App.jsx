import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import StudyRoom from './pages/StudyRoom';
import AdminPanel from './pages/AdminPanel';
import Flashcards from './pages/Flashcards';
import Scheduler from './pages/Scheduler';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Whiteboard from './pages/Whiteboard';
import PomodoroTimer from './pages/PomodoroTimer';
import Notes from './pages/Notes';
import { useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-container">
      {!isAuthPage && <Sidebar />}
      
      <div className="main-content">
        {!isAuthPage && <Topbar />}
        
        <div className={isAuthPage ? '' : 'content-wrapper'}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
            <Route path="/scheduler" element={<ProtectedRoute><Scheduler /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            <Route path="/room/:id" element={
              <ProtectedRoute>
                 <SocketProvider>
                    <StudyRoom />
                 </SocketProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/room/:id/chat" element={
              <ProtectedRoute>
                 <SocketProvider>
                    <Chat />
                 </SocketProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/room/:id/whiteboard" element={
              <ProtectedRoute>
                 <SocketProvider>
                    <Whiteboard />
                 </SocketProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/room/:id/timer" element={
              <ProtectedRoute>
                 <SocketProvider>
                    <PomodoroTimer />
                 </SocketProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/room/:id/notes" element={
              <ProtectedRoute>
                 <SocketProvider>
                    <Notes />
                 </SocketProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
