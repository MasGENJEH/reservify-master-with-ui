import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Hotel, DoorOpen, LogOut, Settings } from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { username: 'Admin User', role: 'Admin' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/rooms', name: 'Rooms', icon: <Hotel size={20} /> },
    { path: '/facilities', name: 'Facilities', icon: <DoorOpen size={20} /> },
    { path: '/employees', name: 'Employees', icon: <Users size={20} /> },
    { path: '/transactions', name: 'Transactions', icon: <LayoutDashboard size={20} /> },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">R</span>
            <h2>Reservify</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item text-danger" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar glass-panel">
          <div className="topbar-search">
            {/* Search or breadcrumbs could go here */}
            <h3>Dashboard</h3>
          </div>
          
          <div className="topbar-actions">
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{user.name || user.username}</span>
                <span className="user-role">{user.role || 'Admin'}</span>
              </div>
              <div className="user-avatar">
                {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
