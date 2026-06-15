import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await apiClient.get('/facilities');
      setFacilities(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2>Facilities Management</h2>
          <p>Manage office facilities and inventory.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Add Facility
        </button>
      </div>

      <div className="glass-panel table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading data...</td></tr>
            ) : facilities.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No facilities found</td></tr>
            ) : (
              facilities.map((fac) => (
                <tr key={fac.id}>
                  <td>{fac.id.substring(0, 8)}...</td>
                  <td><strong>{fac.name}</strong></td>
                  <td>{fac.quantity}</td>
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

export default Facilities;
