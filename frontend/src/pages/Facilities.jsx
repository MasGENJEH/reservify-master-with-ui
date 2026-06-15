import React, { useState } from 'react';
import { Settings, Plus, X } from 'lucide-react';
import apiClient from '../api/client';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import ActionButtons from '../components/ui/ActionButtons';

export default function Facilities({ facilities, setFacilities, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', quantity: '' });
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ name: '' });

  const filteredItems = facilities.filter(f => {
    const matchesGlobal = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesName = filters.name === '' || f.name.toLowerCase().includes(filters.name.toLowerCase());
    return matchesGlobal && matchesName;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/facilities', {
        name: formData.name,
        quantity: parseInt(formData.quantity) || 0
      });
      setShowModal(false);
      setFormData({ name: '', quantity: '' });
      onRefresh();
    } catch (error) {
      alert('Failed to add facility: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 flex-1 rounded-3xl p-6 bg-white border border-monday-border shadow-sm">
      <PageHeader 
        title="Manage Facilities"
        description={`Manage all facility assets. Total: ${facilities.length} facilities registered.`}
        icon={Settings}
        actionLabel="Add Facility"
        actionIcon={Plus}
        onActionClick={() => setShowModal(true)}
      />

      <div className="flex items-center justify-between">
        <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search facilities..." />
      </div>

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
            {filteredItems.map((fac, index) => (
              <tr key={fac.id} className="hover:bg-monday-gray-background/30 transition-colors">
                <td className="py-3.5 px-6 text-monday-gray font-mono font-semibold">{index + 1}</td>
                <td className="py-3.5 px-6 font-bold text-monday-blue">{fac.name}</td>
                <td className="py-3.5 px-6 font-semibold">{fac.quantity}</td>
                <td className="py-3.5 px-6 text-right">
                  <ActionButtons onEdit={() => {}} onDelete={() => {}} />
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr><td colSpan="4" className="py-8 text-center text-monday-gray font-semibold">No facilities found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Facility Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292D32B2] backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-monday-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-monday-border">
              <h3 className="font-extrabold text-lg text-monday-black">Add New Facility</h3>
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
