import React, { useState } from 'react';
import { ClipboardList, Plus, X } from 'lucide-react';
import apiClient from '../api/client';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import ActionButtons from '../components/ui/ActionButtons';
import Pagination from '../components/ui/Pagination';

export default function Transactions() {
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [paging, setPaging] = useState({ totalRows: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ employee_id: '', room_id: '', description: '', start_time: '', end_time: '' });
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ description: '', status: '' });

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [trxRes, roomsRes, empRes] = await Promise.all([
        apiClient.get(`/transactions?page=${currentPage}&size=${itemsPerPage}`),
        apiClient.get('/rooms?page=1&size=1000'),
        apiClient.get('/employees?page=1&size=1000')
      ]);
      setData(trxRes.data?.data || []);
      setRooms(roomsRes.data?.data || []);
      setEmployees(empRes.data?.data || []);
      if (trxRes.data?.paging) {
        setPaging(trxRes.data.paging);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Local filtering for search query
  const currentItems = data.filter(t => {
    const matchesGlobal = (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDesc = filters.description === '' || (t.description || '').toLowerCase().includes(filters.description.toLowerCase());
    const matchesStatus = filters.status === '' || (t.status || '').toLowerCase().includes(filters.status.toLowerCase());
    return matchesGlobal && matchesDesc && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/transactions', {
        employeeId: formData.employee_id,
        roomId: formData.room_id,
        description: formData.description,
        startTime: formData.start_time ? new Date(formData.start_time).toISOString() : '',
        endTime: formData.end_time ? new Date(formData.end_time).toISOString() : '',
      });
      setShowModal(false);
      setFormData({ employee_id: '', room_id: '', description: '', start_time: '', end_time: '' });
      fetchData();
    } catch (error) {
      alert('Failed to create transaction: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-100 text-emerald-700';
      case 'declined': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="flex flex-col gap-6 flex-1 rounded-3xl p-6 bg-white border border-monday-border shadow-sm">
      <PageHeader 
        title="Manage Transactions"
        description={`Manage all room booking transactions.`}
        icon={ClipboardList}
        actionLabel="New Booking"
        actionIcon={Plus}
        onActionClick={() => setShowModal(true)}
      />

      <div className="flex items-center justify-between">
        <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search transactions..." />
      </div>

      {loading ? (
        <div className="py-20 text-center text-monday-gray font-semibold">Loading transactions...</div>
      ) : (
      <div className="border border-monday-border rounded-2xl overflow-x-auto overflow-y-hidden bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-monday-gray-background border-b border-monday-border text-xs font-bold uppercase tracking-wider text-monday-gray">
              <th className="py-4 px-6">No</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Start Time</th>
              <th className="py-4 px-6">End Time</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
            <tr className="bg-monday-background/50 border-b border-monday-border">
              <th className="py-2 px-6"></th>
              <th className="py-2 px-6">
                <input type="text" placeholder="Filter..." className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-monday-border focus:outline-none focus:border-monday-blue font-normal normal-case tracking-normal text-monday-black placeholder:text-monday-gray/50 bg-white" value={filters.description} onChange={e => setFilters({...filters, description: e.target.value})} />
              </th>
              <th className="py-2 px-6">
                <input type="text" placeholder="Filter..." className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-monday-border focus:outline-none focus:border-monday-blue font-normal normal-case tracking-normal text-monday-black placeholder:text-monday-gray/50 bg-white" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} />
              </th>
              <th className="py-2 px-6"></th>
              <th className="py-2 px-6"></th>
              <th className="py-2 px-6">
                <button onClick={() => setFilters({ description: '', status: '' })} className="w-full px-2.5 py-1.5 text-[11px] font-bold text-monday-gray hover:text-monday-red hover:bg-monday-red/10 rounded-lg transition-all flex items-center justify-center gap-1 normal-case tracking-normal cursor-pointer">Reset</button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-monday-border text-sm text-monday-black">
            {currentItems.map((trx, index) => (
              <tr key={trx.id} className="hover:bg-monday-gray-background/30 transition-colors">
                <td className="py-3.5 px-6 text-monday-gray font-mono font-semibold">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="py-3.5 px-6 font-semibold">{trx.description || '-'}</td>
                <td className="py-3.5 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(trx.status)}`}>
                    {trx.status}
                  </span>
                </td>
                <td className="py-3.5 px-6 text-monday-gray text-xs">{trx.startTime ? new Date(trx.startTime).toLocaleString() : '-'}</td>
                <td className="py-3.5 px-6 text-monday-gray text-xs">{trx.endTime ? new Date(trx.endTime).toLocaleString() : '-'}</td>
                <td className="py-3.5 px-6 text-right">
                  <ActionButtons onEdit={() => {}} onDelete={() => {}} />
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr><td colSpan="6" className="py-8 text-center text-monday-gray font-semibold">No transactions found</td></tr>
            )}
          </tbody>
        </table>
        {paging.totalRows > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={paging.totalPages}
            onPageChange={setCurrentPage}
            totalItems={paging.totalRows}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
      )}

      {/* New Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292D32B2] backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-monday-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-monday-border">
              <h3 className="font-extrabold text-lg text-monday-black">New Room Booking</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-monday-gray hover:text-monday-black hover:bg-monday-gray-background rounded-lg transition-300 cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Employee</label>
                <select required value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black">
                  <option value="">-- Select Employee --</option>
                  {(employees || []).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Room</label>
                <select required value={formData.room_id} onChange={e => setFormData({...formData, room_id: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black">
                  <option value="">-- Select Room --</option>
                  {(rooms || []).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Description</label>
                <input type="text" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" placeholder="e.g. Team standup meeting" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Start Time</label>
                <input type="datetime-local" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">End Time</label>
                <input type="datetime-local" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-monday-border">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-monday-gray hover:bg-monday-gray-background rounded-full transition-300 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-monday-blue text-white rounded-full font-bold text-sm hover:bg-opacity-90 transition-300 cursor-pointer disabled:opacity-50">{submitting ? 'Saving...' : 'Create Booking'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
