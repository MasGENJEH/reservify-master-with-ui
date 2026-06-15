import React, { useState } from 'react';
import { Users, Plus, X } from 'lucide-react';
import apiClient from '../api/client';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import ActionButtons from '../components/ui/ActionButtons';

export default function Employees({ employees, setEmployees, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', role: 'employee', division: '', position: '', contact: '' });
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ name: '', role: '', division: '' });

  const filteredItems = employees.filter(e => {
    const matchesGlobal = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesName = filters.name === '' || e.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesRole = filters.role === '' || e.role?.toLowerCase().includes(filters.role.toLowerCase());
    const matchesDivision = filters.division === '' || e.division?.toLowerCase().includes(filters.division.toLowerCase());
    return matchesGlobal && matchesName && matchesRole && matchesDivision;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/employees', formData);
      setShowModal(false);
      setFormData({ name: '', username: '', password: '', role: 'employee', division: '', position: '', contact: '' });
      onRefresh();
    } catch (error) {
      alert('Failed to add employee: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 flex-1 rounded-3xl p-6 bg-white border border-monday-border shadow-sm">
      <PageHeader 
        title="Manage Employees"
        description={`Manage all registered employees. Total: ${employees.length} employees.`}
        icon={Users}
        actionLabel="Add Employee"
        actionIcon={Plus}
        onActionClick={() => setShowModal(true)}
      />

      <div className="flex items-center justify-between">
        <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search employees..." />
      </div>

      <div className="border border-monday-border rounded-2xl overflow-x-auto overflow-y-hidden bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-monday-gray-background border-b border-monday-border text-xs font-bold uppercase tracking-wider text-monday-gray">
              <th className="py-4 px-6">No</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Username</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Division</th>
              <th className="py-4 px-6">Position</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
            <tr className="bg-monday-background/50 border-b border-monday-border">
              <th className="py-2 px-6"></th>
              <th className="py-2 px-6">
                <input type="text" placeholder="Filter..." className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-monday-border focus:outline-none focus:border-monday-blue font-normal normal-case tracking-normal text-monday-black placeholder:text-monday-gray/50 bg-white" value={filters.name} onChange={e => setFilters({...filters, name: e.target.value})} />
              </th>
              <th className="py-2 px-6"></th>
              <th className="py-2 px-6">
                <input type="text" placeholder="Filter..." className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-monday-border focus:outline-none focus:border-monday-blue font-normal normal-case tracking-normal text-monday-black placeholder:text-monday-gray/50 bg-white" value={filters.role} onChange={e => setFilters({...filters, role: e.target.value})} />
              </th>
              <th className="py-2 px-6">
                <input type="text" placeholder="Filter..." className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-monday-border focus:outline-none focus:border-monday-blue font-normal normal-case tracking-normal text-monday-black placeholder:text-monday-gray/50 bg-white" value={filters.division} onChange={e => setFilters({...filters, division: e.target.value})} />
              </th>
              <th className="py-2 px-6"></th>
              <th className="py-2 px-6">
                <button onClick={() => setFilters({ name: '', role: '', division: '' })} className="w-full px-2.5 py-1.5 text-[11px] font-bold text-monday-gray hover:text-monday-red hover:bg-monday-red/10 rounded-lg transition-all flex items-center justify-center gap-1 normal-case tracking-normal cursor-pointer">Reset</button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-monday-border text-sm text-monday-black">
            {filteredItems.map((emp, index) => (
              <tr key={emp.id} className="hover:bg-monday-gray-background/30 transition-colors">
                <td className="py-3.5 px-6 text-monday-gray font-mono font-semibold">{index + 1}</td>
                <td className="py-3.5 px-6 font-bold text-monday-blue">{emp.name}</td>
                <td className="py-3.5 px-6 font-semibold">@{emp.username}</td>
                <td className="py-3.5 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${emp.role === 'admin' ? 'bg-purple-100 text-purple-700' : emp.role === 'ga' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {emp.role}
                  </span>
                </td>
                <td className="py-3.5 px-6">{emp.division}</td>
                <td className="py-3.5 px-6">{emp.position}</td>
                <td className="py-3.5 px-6 text-right">
                  <ActionButtons onEdit={() => {}} onDelete={() => {}} />
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr><td colSpan="7" className="py-8 text-center text-monday-gray font-semibold">No employees found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292D32B2] backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-monday-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-monday-border">
              <h3 className="font-extrabold text-lg text-monday-black">Add New Employee</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-monday-gray hover:text-monday-black hover:bg-monday-gray-background rounded-lg transition-300 cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Username</label>
                <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" placeholder="e.g. johndoe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" placeholder="Min. 8 characters" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black">
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                  <option value="ga">GA</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Division</label>
                <input type="text" required value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" placeholder="e.g. IT" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Position</label>
                <input type="text" required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" placeholder="e.g. Staff" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-monday-gray uppercase tracking-wider block">Contact</label>
                <input type="text" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-monday-border rounded-xl text-sm focus:outline-none focus:border-monday-black font-semibold text-monday-black" placeholder="e.g. 081234567890" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-monday-border">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-monday-gray hover:bg-monday-gray-background rounded-full transition-300 cursor-pointer">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-monday-blue text-white rounded-full font-bold text-sm hover:bg-opacity-90 transition-300 cursor-pointer disabled:opacity-50">{submitting ? 'Saving...' : 'Save Employee'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
