import React from 'react';
import { DoorOpen, Settings, Users, ClipboardList, ArrowRight } from 'lucide-react';

export default function Dashboard({ rooms, totals, setActiveTab }) {
  const metrics = [
    { label: 'Total Rooms', value: totals.rooms, icon: DoorOpen, color: 'monday-blue', tab: 'rooms' },
    { label: 'Total Facilities', value: totals.facilities, icon: Settings, color: 'monday-lime-green', tab: 'facilities' },
    { label: 'Total Employees', value: totals.employees, icon: Users, color: 'monday-blue', tab: 'employees' },
    { label: 'Total Transactions', value: totals.transactions, icon: ClipboardList, color: 'monday-red', tab: 'transactions' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="blue-gradient rounded-3xl p-8 text-white shadow-lg">
        <h2 className="font-extrabold text-2xl mb-2">Welcome to Reservify!</h2>
        <p className="text-white/80 text-sm font-medium max-w-xl">Manage your room bookings, facilities, and employee data all in one place. Use the sidebar to navigate between modules.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveTab(m.tab)}
              className="bg-white border border-monday-border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-300 text-left cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-${m.color}/10`}>
                  <Icon size={22} className={`text-${m.color}`} />
                </div>
                <ArrowRight size={18} className="text-monday-gray group-hover:text-monday-blue group-hover:translate-x-1 transition-300" />
              </div>
              <div>
                <p className="font-extrabold text-3xl text-monday-black">{m.value}</p>
                <p className="text-sm text-monday-gray font-semibold mt-1">{m.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent Rooms */}
      <div className="bg-white border border-monday-border rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-monday-border mb-4">
          <h3 className="font-extrabold text-lg text-monday-black">Recent Rooms</h3>
          <button onClick={() => setActiveTab('rooms')} className="text-sm font-bold text-monday-blue hover:underline cursor-pointer">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-monday-gray-background border-b border-monday-border text-xs font-bold uppercase tracking-wider text-monday-gray">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-monday-border text-sm text-monday-black">
              {rooms.slice(0, 5).map((room) => (
                <tr key={room.id} className="hover:bg-monday-gray-background/30 transition-colors">
                  <td className="py-3 px-4 font-semibold">{room.name}</td>
                  <td className="py-3 px-4">{room.room_type}</td>
                  <td className="py-3 px-4">{room.capacity} Pax</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${room.status === 'available' ? 'bg-emerald-100 text-emerald-700' : room.status === 'booked' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {room.status}
                    </span>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && (
                <tr><td colSpan="4" className="py-8 text-center text-monday-gray font-semibold">No rooms found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
