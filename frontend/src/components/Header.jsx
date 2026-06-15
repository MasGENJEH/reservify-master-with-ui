import React from 'react';
import { RefreshCw, User, Menu } from 'lucide-react';

export default function Header({ activeTab, user, onLogout, setIsMobileSidebarOpen, loading, onRefresh }) {
  const roleLabel = user?.role === 'admin' ? 'Administrator' : user?.role === 'ga' ? 'General Affairs' : 'Employee';

  const tabTitles = {
    dashboard: 'Dashboard',
    rooms: 'Rooms',
    facilities: 'Facilities',
    employees: 'Employees',
    transactions: 'Transactions',
  };

  return (
    <header className="flex flex-col-reverse lg:flex-row items-center w-full gap-4 lg:gap-6 mt-4 lg:mt-[30px] mb-6 px-4 lg:px-8 shrink-0 print:hidden">
      <div className="flex items-center gap-4 lg:gap-6 h-auto lg:h-[92px] bg-white w-full rounded-2xl lg:rounded-3xl p-4 lg:p-[18px] border border-monday-border shadow-sm flex-wrap sm:flex-nowrap">
        
        {/* Hamburger Menu Toggle (Mobile) */}
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2.5 rounded-xl bg-monday-gray-background text-monday-black hover:bg-black/5 transition-colors shrink-0 cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col gap-[4px] w-full sm:w-auto flex-1 order-3 sm:order-2 mt-2 sm:mt-0">
          <h1 className="font-extrabold text-xl lg:text-2xl text-monday-black capitalize">
            {tabTitles[activeTab] || activeTab}
          </h1>
        </div>
        
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto order-2 sm:order-3 ml-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-monday-lime-green/20 border border-monday-lime-green/30 text-monday-black text-xs font-bold text-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Online
          </div>

          <button 
            onClick={onRefresh} 
            title="Refresh data" 
            className="flex size-14 rounded-full bg-monday-gray-background items-center justify-center overflow-hidden hover:bg-opacity-80 transition-300 shrink-0 cursor-pointer"
          >
            <RefreshCw size={20} className={`text-monday-black ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="flex items-center shrink-0 w-full lg:w-auto h-auto lg:h-[92px] bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-[18px] border border-monday-border gap-4">
        <div className="flex size-14 rounded-full bg-monday-blue items-center justify-center overflow-hidden shrink-0">
          <User size={24} className="text-white" />
        </div>
        <div className="flex flex-col gap-[2px]">
          <p className="font-bold text-base leading-tight text-monday-black">{user?.name || 'User'}</p>
          <p className="text-xs text-monday-gray font-semibold">{roleLabel}</p>
        </div>
      </div>
    </header>
  );
}
