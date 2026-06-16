import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Facilities from './pages/Facilities';
import Employees from './pages/Employees';
import Transactions from './pages/Transactions';
import apiClient from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.replace('/', '');
    return ['rooms', 'facilities', 'employees', 'transactions'].includes(path) ? path : 'dashboard';
  });
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auth states
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Data states
  const [recentRooms, setRecentRooms] = useState([]);
  const [totals, setTotals] = useState({ rooms: 0, facilities: 0, employees: 0, transactions: 0 });

  // Login handler
  const handleLoginSuccess = (newToken, loggedInUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setToken(newToken);
    setUser(loggedInUser);
    setActiveTab('dashboard');
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setRecentRooms([]);
    setTotals({ rooms: 0, facilities: 0, employees: 0, transactions: 0 });
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, facilitiesRes, employeesRes, transactionsRes] = await Promise.all([
        apiClient.get('/rooms?page=1&size=5').catch(() => ({ data: { data: [], paging: { totalRows: 0 } } })),
        apiClient.get('/facilities?page=1&size=1').catch(() => ({ data: { paging: { totalRows: 0 } } })),
        apiClient.get('/employees?page=1&size=1').catch(() => ({ data: { paging: { totalRows: 0 } } })),
        apiClient.get('/transactions?page=1&size=1').catch(() => ({ data: { paging: { totalRows: 0 } } })),
      ]);
      setRecentRooms(roomsRes.data?.data || []);
      setTotals({
        rooms: roomsRes.data?.paging?.totalRows || 0,
        facilities: facilitiesRes.data?.paging?.totalRows || 0,
        employees: employeesRes.data?.paging?.totalRows || 0,
        transactions: transactionsRes.data?.paging?.totalRows || 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchData();
      window.history.replaceState(null, '', `/${activeTab === 'dashboard' ? '' : activeTab}`);
    }
  }, [activeTab, user, token]);

  // Not logged in
  if (!user || !token) {
    if (window.location.pathname !== '/login') {
      window.history.replaceState(null, '', '/login');
    }
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Render active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard rooms={recentRooms} totals={totals} setActiveTab={setActiveTab} />;
      case 'rooms':
        return <Rooms />;
      case 'facilities':
        return <Facilities />;
      case 'employees':
        return <Employees />;
      case 'transactions':
        return <Transactions />;
      default:
        return <Dashboard rooms={recentRooms} totals={totals} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-monday-background text-monday-black font-sans">

      {/* Sidebar Overlay for Mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        isMinimized={isSidebarMinimized}
        setIsMinimized={setIsSidebarMinimized}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">

        {/* Header */}
        <Header
          activeTab={activeTab}
          user={user}
          onLogout={handleLogout}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          loading={loading}
          onRefresh={fetchData}
        />

        {/* Content */}
        <div className="px-4 lg:px-8 pb-12 w-full space-y-6 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <RefreshCw size={40} className="text-monday-blue animate-spin" />
              <p className="text-monday-gray text-sm font-semibold">Loading data from server...</p>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>
    </div>
  );
}
