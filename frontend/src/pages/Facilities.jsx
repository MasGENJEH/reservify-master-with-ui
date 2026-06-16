import React, { useState } from 'react';
import { Settings, Plus, X } from 'lucide-react';
import apiClient from '../api/client';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import ActionButtons from '../components/ui/ActionButtons';
import Pagination from '../components/ui/Pagination';

export default function Facilities() {
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState({ totalRows: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', quantity: '' });
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ name: '' });

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/facilities?page=${currentPage}&size=${itemsPerPage}`);
      setData(res.data?.data || []);
      if (res.data?.paging) {
        setPaging(res.data.paging);
      }
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Local filtering for search query
  const currentItems = data.filter(f => {
    const matchesGlobal = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesName = filters.name === '' || f.name.toLowerCase().includes(filters.name.toLowerCase());
    return matchesGlobal && matchesName;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editMode) {
        await apiClient.put('/facilities', {
          id: currentId,
          name: formData.name,
          quantity: parseInt(formData.quantity) || 0
        });
      } else {
        await apiClient.post('/facilities', {
          name: formData.name,
          quantity: parseInt(formData.quantity) || 0
        });
      }
      setShowModal(false);
      setFormData({ name: '', quantity: '' });
      setEditMode(false);
      setCurrentId(null);
      fetchData();
    } catch (error) {
      alert('Failed to add facility: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (fac) => {
    setFormData({ name: fac.name, quantity: fac.quantity.toString() });
    setCurrentId(fac.id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      try {
        await apiClient.delete(`/facilities/${id}`);
        fetchData();
      } catch (error) {
        alert('Failed to delete facility: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 flex-1 rounded-3xl p-6 bg-white border border-monday-border shadow-sm">
      <PageHeader 
        title="Manage Facilities"
        description={`Manage all facility assets.`}
        icon={Settings}
        actionLabel="Add Facility"
        actionIcon={Plus}
        onActionClick={() => {
          setEditMode(false);
          setCurrentId(null);
          setFormData({ name: '', quantity: '' });
          setShowModal(true);
        }}
      />

      <div className="flex items-center justify-between">
        <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search facilities..." />
      </div>

      {loading ? (
        <div className="py-20 text-center text-monday-gray font-semibold">Loading facilities...</div>
      ) : (
      <div className="border border-monday-border rounded-2xl overflow-x-auto overflow-y-hidden bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-monday-gray-background border-b border-monday-border text-xs font-bold uppercase tracking-wider text-monday-gray">
              <th className="py-4 px-6">No</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Quantity</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
            <tr className="bg-monday-background/50 border-b border-monday-border">
              <th className="py-2 px-6"></th>
              <th className="py-2 px-6">
                <input type="text" placeholder="Filter..." className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-monday-border focus:outline-none focus:border-monday-blue font-normal normal-case tracking-normal text-monday-black placeholder:text-monday-gray/50 bg-white" value={filters.name} onChange={e => setFilters({...filters, name: e.target.value})} />
              </th>
              <th className="py-2 px-6"></th>
              <th className="py-2 px-6">
                <button onClick={() => setFilters({ name: '' })} className="w-full px-2.5 py-1.5 text-[11px] font-bold text-monday-gray hover:text-monday-red hover:bg-monday-red/10 rounded-lg transition-all flex items-center justify-center gap-1 normal-case tracking-normal cursor-pointer">Reset</button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-monday-border text-sm text-monday-black">
            {currentItems.map((fac, index) => (
              <tr key={fac.id} className="hover:bg-monday-gray-background/30 transition-colors">
                <td className="py-3.5 px-6 text-monday-gray font-mono font-semibold">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="py-3.5 px-6 font-bold text-monday-blue">{fac.name}</td>
                <td className="py-3.5 px-6 font-semibold">{fac.quantity}</td>
                <td className="py-3.5 px-6 text-right">
                  <ActionButtons onEdit={() => handleEdit(fac)} onDelete={() => handleDelete(fac.id)} />
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr><td colSpan="4" className="py-8 text-center text-monday-gray font-semibold">No facilities found</td></tr>
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

      {/* Add Facility Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292D32B2] backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-monday-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-monday-border">
              <h3 className="font-extrabold text-lg text-monday-black">{editMode ? 'Edit Facility' : 'Add New Facility'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-monday-gray hover:text-monday-black hover:bg-monday-gray-background rounded-lg transition-300 cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Facility Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" placeholder="e.g. Projector" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Quantity</label>
                <input type="number" required min="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-monday-border">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-monday-gray hover:bg-monday-gray-background rounded-full transition-300 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-monday-blue text-white rounded-full font-bold text-sm hover:bg-opacity-90 transition-300 cursor-pointer disabled:opacity-50">{submitting ? 'Saving...' : 'Save Facility'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
