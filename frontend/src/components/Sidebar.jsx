import React from 'react';
import { Home, DoorOpen, Settings, Users, ClipboardList, Layers, LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, onLogout, isMinimized, setIsMinimized, isMobileSidebarOpen, setIsMobileSidebarOpen }) {
  const role = user?.role || 'employee';

  const menuGroups = [
    {
      title: 'Main Menu',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'rooms', label: 'Rooms', icon: DoorOpen },
        { id: 'facilities', label: 'Facilities', icon: Settings },
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'transactions', label: 'Transactions', icon: ClipboardList },
      ]
    }
  ];

  return (
    <>
      <aside className={`relative h-auto shrink-0 transition-all duration-300 print:hidden hidden lg:block ${isMinimized ? 'w-[88px]' : 'w-[280px]'}`} />
      <div className={`flex flex-col fixed top-0 left-0 shrink-0 h-screen pt-[30px] gap-[24px] bg-white border-r border-monday-border transition-all duration-300 z-50 lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} ${isMinimized ? 'w-[88px] px-2' : 'w-[280px] px-4'}`}>

        {/* Toggle Button */}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute -right-4 top-[35px] hidden lg:flex items-center justify-center size-8 rounded-full shadow-lg shadow-monday-blue/20 z-50 transition-all duration-300 cursor-pointer border-[3px] border-white bg-monday-blue text-white hover:scale-110 hover:bg-opacity-90 group"
        >
          {isMinimized ? (
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          ) : (
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
          )}
        </button>

        {/* Logo Brand */}
        <div className={`flex items-center justify-between ${isMinimized ? 'justify-center px-0' : 'px-4'}`}>
          <div className="flex items-center gap-3">
            <div className="bg-monday-blue p-2.5 rounded-2xl text-white shrink-0">
              <Layers size={22} />
            </div>
            {!isMinimized && (
              <div className="overflow-hidden whitespace-nowrap">
                <h1 className="font-extrabold text-xl text-monday-black uppercase tracking-tight">RESERVIFY</h1>
                <p className="text-[9px] text-monday-gray font-extrabold tracking-widest uppercase">BOOKING SYSTEM</p>
              </div>
            )}
          </div>
          {/* Close button for mobile */}
          <button
            className="lg:hidden p-1.5 text-monday-gray hover:bg-monday-gray-background rounded-lg transition-colors ml-2 shrink-0"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <hr className={`border-monday-border ${isMinimized ? 'mx-2' : 'mx-4'}`} />

        {/* Nav List */}
        <div className={`flex flex-col gap-6 overflow-y-auto hide-scrollbar h-full pb-[100px] ${isMinimized ? 'items-center' : ''}`}>
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="flex flex-col gap-2">
              {isMinimized ? (
                <div className="w-full flex justify-center"><hr className="border-monday-border w-6" /></div>
              ) : (
                <p className="font-bold text-xs text-monday-gray uppercase tracking-wider px-4">{group.title}</p>
              )}

              <nav className={`space-y-1 ${isMinimized ? 'flex flex-col items-center w-full px-2' : 'w-full'}`}>
                {group.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      title={tab.label}
                      className={`flex items-center transition-300 cursor-pointer ${isMinimized
                        ? 'justify-center p-3 rounded-2xl w-12 h-12'
                        : 'w-full gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold'
                        } ${isActive
                          ? 'bg-monday-blue/10 text-monday-blue'
                          : 'text-monday-black hover:bg-monday-gray-background'
                        }`}
                    >
                      <Icon size={18} className={isActive ? 'text-monday-blue' : 'text-monday-black'} />
                      {!isMinimized && (
                        <>
                          <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">{tab.label}</span>
                          {isActive && <div className="w-1.5 h-6 rounded-l-md bg-monday-blue ml-auto"></div>}
                        </>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Logout & Footer */}
        <div className={`flex flex-col gap-2 bg-white pt-2 border-t border-monday-border mt-auto ${isMinimized ? 'items-center px-0 pb-4' : ''}`}>
          <button
            onClick={onLogout}
            title="Logout"
            className={`flex items-center transition-300 cursor-pointer text-monday-red hover:bg-monday-red/10 ${isMinimized
              ? 'justify-center p-3 rounded-2xl w-12 h-12 mb-2'
              : 'w-full gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold'
              }`}
          >
            <LogOut size={18} className="text-monday-red shrink-0" />
            {!isMinimized && <span className="flex-1 text-left whitespace-nowrap overflow-hidden">Logout</span>}
          </button>

          {!isMinimized && (
            <div className="p-4 text-center whitespace-nowrap overflow-hidden">
              <p className="text-xs text-monday-gray font-bold">Reservify v1.0.0 &copy; 2026</p>
              <p className="text-[10px] text-monday-blue font-extrabold mt-0.5">Room Booking System</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
