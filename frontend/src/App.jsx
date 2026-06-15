import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Rooms from './pages/Rooms';
import Facilities from './pages/Facilities';
import Employees from './pages/Employees';
import Transactions from './pages/Transactions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/rooms" replace />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="employees" element={<Employees />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
