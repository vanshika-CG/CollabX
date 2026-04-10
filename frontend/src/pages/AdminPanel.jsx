import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const { user } = useAuth();
  
  const fetchAdminData = async () => {
      try {
          const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }};
          const usersRes = await axios.get('http://localhost:5000/api/admin/users', config);
          const roomsRes = await axios.get('http://localhost:5000/api/admin/rooms', config);
          setUsers(usersRes.data);
          setRooms(roomsRes.data);
      } catch (err) {
          console.error(err);
      }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchAdminData();
  }, [user]);

  const deleteUser = async (id) => {
      if(!window.confirm('Delete user?')) return;
      try {
          const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }};
          await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
          fetchAdminData();
      } catch (err) {
          alert('Failed to delete user.');
      }
  };

  if (user?.role !== 'admin') {
      return <h2>Access Denied. Admins Only.</h2>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Admin Dashboard</h2>
      
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3>Registered Users</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.role !== 'admin' && (
                      <button className="btn btn-danger" onClick={() => deleteUser(u._id)} style={{ padding: '0.3rem 0.5rem' }}>
                        <Trash2 size={14} />
                      </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-card">
        <h3>Active System Rooms</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Creator</th>
              <th>Privacy</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(r => (
              <tr key={r._id}>
                <td>{r.name}</td>
                <td>{r.creator?.username}</td>
                <td>{r.isPrivate ? 'Private' : 'Public'}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
