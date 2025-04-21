import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import TenantDashboard from './pages/TenantDashboard';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './contexts/AuthContext';
import withAuth from './withAuth'; // Use named import

// Define protected components by wrapping them with the HOC
const ProtectedAdminDashboard = withAuth(AdminDashboard, { expectedRole: 'ROLE_ADMIN' });
const ProtectedTenantDashboard = withAuth(TenantDashboard, { expectedRole: 'ROLE_TENANT' });


function App() {
  return (
    <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/admin/dashboard" element={<ProtectedAdminDashboard />} />
          <Route path="/tenant/dashboard" element={<ProtectedTenantDashboard />} />

          {/* Redirect root path to login */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />
          
          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
