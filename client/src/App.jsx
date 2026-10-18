import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ComplaintList from './pages/ComplaintList';
import MasterRef from './pages/MasterRef';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import ActivityLogUser from './pages/ActivityLogUser';
import ActivityLogApp from './pages/ActivityLogApp';

import SqlExecute from './pages/SqlExecute';
import ImportCSV from './pages/ImportCSV';
import NavigationLogger from './components/NavigationLogger';


import ForceChangePasswordModal from './components/ForceChangePasswordModal';

const PrivateLayout = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [warning, setWarning] = useState(null);

  // Check Session Expiration synchronously
  const storedUser = localStorage.getItem('user');
  const loginTime = localStorage.getItem('loginTime');
  const EIGHT_HOURS = 8 * 60 * 60 * 1000;

  if (storedUser) {
    if (loginTime && Date.now() - parseInt(loginTime) > EIGHT_HOURS) {
      localStorage.removeItem('user');
      localStorage.removeItem('loginTime');
      // Let it fall through to Navigate
    } else if (!loginTime) {
      localStorage.setItem('loginTime', Date.now().toString());
    }
  }

  useEffect(() => {
    const activeUser = localStorage.getItem('user');
    if (activeUser) {
      setUser(JSON.parse(activeUser));
    }

    const handleWarning = (e) => {
      setWarning(e.detail);
      setTimeout(() => setWarning(null), 5000); // Auto hide after 5s
    };

    window.addEventListener('app-performance-warning', handleWarning);
    return () => window.removeEventListener('app-performance-warning', handleWarning);
  }, []);

  const handlePasswordChanged = () => {
    // Update local user state
    if (user) {
      const updatedUser = { ...user, must_change_password: 0 };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist the flag change
      // Force reload or just state update is enough? State update triggers re-render.
    }
  };

  if (!localStorage.getItem('user')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex">
      {user?.must_change_password === 1 && (
        <ForceChangePasswordModal
          user={user}
          onSuccess={handlePasswordChanged}
          onLogout={() => { /* Optional logout handler if needed */ }}
        />
      )}
      <NavigationLogger />
      <Sidebar user={user} />
      <main className="main-content w-full relative">
        <Outlet context={{ user }} />
        {warning && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 99999,
            background: '#fff3cd',
            color: '#856404',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #ffeeba',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <strong>System Warning:</strong> {warning}. Please clear cache if issue persists.
          </div>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<PrivateLayout />}>
          <Route index element={<Navigate to="/ciu/complaints" replace />} />

          {/* Ciu Routes */}
          <Route path="ciu/complaints" element={<ComplaintList />} />
          <Route path="ciu/import-csv" element={<ImportCSV />} />

          {/* Admin Routes */}
          <Route path="users" element={<UserManagement />} />
          <Route path="execute-sql" element={<SqlExecute />} />

          {/* Activity Logs */}
          <Route path="activity/user" element={<ActivityLogUser />} />
          <Route path="activity/app" element={<ActivityLogApp />} />

          {/* Master Routes */}
          <Route path="master/:type" element={<MasterRef />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
