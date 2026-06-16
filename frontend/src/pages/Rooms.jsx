import React, { useState } from 'react';
import { DoorOpen, Plus, X } from 'lucide-react';
import apiClient from '../api/client';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import ActionButtons from '../components/ui/ActionButtons';
import Pagination from '../components/ui/Pagination';

export default function Rooms() {
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState({ totalRows: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', room_type: 'Meeting', capacity: '', status: 'available' });
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ name: '', room_type: '', status: '' });

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/rooms?page=${currentPage}&size=${itemsPerPage}${filters.status ? `&status=${filters.status}` : ''}`);
      setData(res.data?.data || []);
      if (res.data?.paging) {
        setPaging(res.data.paging);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [currentPage, filters.status]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters.status]);

  // Local filtering for search query and other fields not supported by backend
  const currentItems = data.filter(r => {
    const matchesGlobal = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.room_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesName = filters.name === '' || r.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesType = filters.room_type === '' || r.room_type.toLowerCase().includes(filters.room_type.toLowerCase());
    return matchesGlobal && matchesName && matchesType;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editMode) {
        await apiClient.put('/rooms', {
          id: currentId,
          name: formData.name,
          room_type: formData.room_type,
          capacity: parseInt(formData.capacity) || 0,
          status: formData.status
        });
      } else {
        await apiClient.post('/rooms', {
          name: formData.name,
          room_type: formData.room_type,
          capacity: parseInt(formData.capacity) || 0,
          status: formData.status
        });
      }
      setShowModal(false);
      setFormData({ name: '', room_type: 'Meeting', capacity: '', status: 'available' });
      setEditMode(false);
      setCurrentId(null);
      fetchData();
    } catch (error) {
      alert('Failed to save room: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (room) => {
    setFormData({ name: room.name, room_type: room.room_type, capacity: room.capacity.toString(), status: room.status });
    setCurrentId(room.id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await apiClient.delete(`/rooms/${id}`);
        fetchData();
      } catch (error) {
        alert('Failed to delete room: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 flex-1 rounded-3xl p-6 bg-white border border-monday-border shadow-sm">
      <PageHeader 
        title="Manage Rooms"
        description={`Manage all booking rooms.`}
        icon={DoorOpen}
        actionLabel="Add Room"
        actionIcon={Plus}
        onActionClick={() => {
          setEditMode(false);
          setCurrentId(null);
          setFormData({ name: '', room_type: '', capacity: '', status: 'available' });
          setShowModal(true);
        }}
      />

      <div className="flex items-center justify-between">
        <SearchInput 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search rooms..."
        />
      </div>

      {loading ? (
        <div className="py-20 text-center text-monday-gray font-semibold">Loading rooms...</div>
      ) : (
      <div className="border border-monday-border rounded-2xl overflow-x-auto overflow-y-hidden bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-monday-gray-background border-b border-monday-border text-xs font-bold uppercase tracking-wider text-monday-gray">
              <th className="py-4 px-6">No</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Type</th>
              <th className="py-4 px-6">Capacity</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
            <tr className="bg-monday-background/50 border-b border-monday-border">
              <th className="py-2 px-6"></th>
              <th className="py-2 px-6">
                <input type="text" placeholder="Filter..." className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-monday-border focus:outline-none focus:border-monday-blue font-normal normal-case tracking-normal text-monday-black placeholder:text-monday-gray/50 bg-white" value={filters.name} onChange={e => setFilters({...filters, name: e.target.value})} />
              </th>
              <th className="py-2 px-6">
                <input type="text" placeholder="Filter..." className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-monday-border focus:outline-none focus:border-monday-blue font-normal normal-case tracking-normal text-monday-black placeholder:text-monday-gray/50 bg-white" value={filters.room_type} onChange={e => setFilters({...filters, room_type: e.target.value})} />
              </th>
              <th className="py-2 px-6"></th>
              <th className="py-2 px-6">
                <input type="text" placeholder="Filter..." className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-monday-border focus:outline-none focus:border-monday-blue font-normal normal-case tracking-normal text-monday-black placeholder:text-monday-gray/50 bg-white" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} />
              </th>
              <th className="py-2 px-6">
                <button onClick={() => setFilters({ name: '', room_type: '', status: '' })} className="w-full px-2.5 py-1.5 text-[11px] font-bold text-monday-gray hover:text-monday-red hover:bg-monday-red/10 rounded-lg transition-all flex items-center justify-center gap-1 normal-case tracking-normal cursor-pointer">Reset</button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-monday-border text-sm text-monday-black">
            {currentItems.map((room, index) => (
              <tr key={room.id} className="hover:bg-monday-gray-background/30 transition-colors">
                <td className="py-3.5 px-6 text-monday-gray font-mono font-semibold">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="py-3.5 px-6 font-bold text-monday-blue">{room.name}</td>
                <td className="py-3.5 px-6 font-semibold">{room.room_type}</td>
                <td className="py-3.5 px-6">{room.capacity} Pax</td>
                <td className="py-3.5 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${room.status === 'available' ? 'bg-emerald-100 text-emerald-700' : room.status === 'booked' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {room.status}
                  </span>
                </td>
                <td className="py-3.5 px-6 text-right">
                  <ActionButtons onEdit={() => handleEdit(room)} onDelete={() => handleDelete(room.id)} />
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr><td colSpan="6" className="py-8 text-center text-monday-gray font-semibold">No rooms found</td></tr>
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

      {/* Add Room Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292D32B2] backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-monday-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-monday-border">
              <h3 className="font-extrabold text-lg text-monday-black">{editMode ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-monday-gray hover:text-monday-black hover:bg-monday-gray-background rounded-lg transition-300 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Room Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" placeholder="e.g. Meeting Room A" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Room Type</label>
                <input type="text" required value={formData.room_type} onChange={e => setFormData({...formData, room_type: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" placeholder="e.g. Meeting, Conference" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Capacity (Pax)</label>
                <input type="number" required min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black">
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-monday-border">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-monday-gray hover:bg-monday-gray-background rounded-full transition-300 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-monday-blue text-white rounded-full font-bold text-sm hover:bg-opacity-90 transition-300 cursor-pointer disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
