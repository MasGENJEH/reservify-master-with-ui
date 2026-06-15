import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await apiClient.get('/rooms');
      setRooms(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2>Rooms Management</h2>
          <p>Manage all available rooms and their statuses.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Add Room
        </button>
      </div>

      <div className="glass-panel table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading data...</td></tr>
            ) : rooms.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No rooms found</td></tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id.substring(0, 8)}...</td>
                  <td><strong>{room.name}</strong></td>
                  <td>{room.room_type}</td>
                  <td>{room.capacity} Pax</td>
                  <td>
                    <span className={`badge ${room.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>
                      {room.status || 'Unknown'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn" style={{ padding: '0.25rem', color: 'var(--accent-color)' }}><Edit2 size={16} /></button>
                      <button className="btn" style={{ padding: '0.25rem', color: 'var(--danger-color)' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rooms;
