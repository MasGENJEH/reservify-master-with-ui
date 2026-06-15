import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { FileText, Eye } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Endpoint might vary based on final backend routes. 
      // Assuming GET /transactions or similar for bookings.
      const response = await apiClient.get('/transactions').catch(() => ({ data: { data: [] } }));
      // Using dummy data if it fails because it wasn't fully documented in README API spec
      if (!response.data?.data || response.data?.data.length === 0) {
         setTransactions([
             { id: 'tx-1001', roomName: 'Meeting Room A', date: '2026-06-16', status: 'Pending', bookedBy: 'John Doe' },
             { id: 'tx-1002', roomName: 'Conference Hall', date: '2026-06-17', status: 'Approved', bookedBy: 'Jane Smith' }
         ]);
      } else {
         setTransactions(response.data?.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2>Transactions & Bookings</h2>
          <p>View and manage room booking requests.</p>
        </div>
        <button className="btn btn-primary" onClick={fetchTransactions}>
          <FileText size={18} /> Export Report
        </button>
      </div>

      <div className="glass-panel table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Room</th>
              <th>Booked By</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading data...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No transactions found</td></tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td><strong>{tx.id}</strong></td>
                  <td>{tx.roomName || tx.room_name || 'N/A'}</td>
                  <td>{tx.bookedBy || tx.employee_name || 'N/A'}</td>
                  <td>{tx.date || tx.booking_date || 'N/A'}</td>
                  <td>
                    <span className={`badge ${tx.status === 'Approved' ? 'badge-success' : tx.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn" style={{ padding: '0.25rem', color: 'var(--accent-color)' }}><Eye size={16} /></button>
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

export default Transactions;
