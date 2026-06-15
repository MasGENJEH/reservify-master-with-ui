import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get('/employees');
      setEmployees(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2>Employees Management</h2>
          <p>Manage system users, roles, and divisions.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Add Employee
        </button>
      </div>

      <div className="glass-panel table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Division</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading data...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No employees found</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td><strong>{emp.name}</strong></td>
                  <td>@{emp.username}</td>
                  <td>
                    <span className="badge badge-success">{emp.role}</span>
                  </td>
                  <td>{emp.division}</td>
                  <td>{emp.position}</td>
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

export default Employees;
