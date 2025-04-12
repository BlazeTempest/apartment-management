import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Page components later when created
// import LoginPage from './pages/LoginPage';
// import AdminPortal from './pages/AdminPortal';
// import TenantPortal from './pages/TenantPortal';
// import NotFoundPage from './pages/NotFoundPage';

// Placeholder components for now
const LoginPage = () => <div>Login Page Placeholder</div>;
const AdminPortal = () => <div>Admin Portal Placeholder</div>;
const TenantPortal = () => <div>Tenant Portal Placeholder</div>;
const NotFoundPage = () => <div>404 Not Found Placeholder</div>;

// Placeholder for authentication check
const isAuthenticated = () => {
  // Replace with actual auth logic (e.g., check JWT in local storage/context)
  // Using sessionStorage like mocks for this placeholder
  return !!sessionStorage.getItem('userRole');
};

const getUserRole = () => {
  // Replace with actual role retrieval from token/context
  return sessionStorage.getItem('userRole'); // Example based on mocks
}

// Simple Protected Route component (can be enhanced later)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  if (!authenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to an unauthorized page or login if role doesn't match
    // For simplicity, redirecting to login here, could be a dedicated '/unauthorized' page
    console.warn(`Unauthorized access attempt to route requiring roles: ${allowedRoles}. User role: ${userRole}`);
    return <Navigate to="/login" replace />; // Or maybe to a specific portal if already logged in but wrong role?
  }

  return children;
};


function App() {
  // Basic structure - Add ThemeProvider, AuthProvider later

  // Apply dark mode based on localStorage (similar to mocks)
  // This should ideally be in a ThemeProvider context
  React.useEffect(() => {
    const applyTheme = () => {
      if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    applyTheme();
    // Optional: Listen for storage changes to update theme across tabs
    window.addEventListener('storage', applyTheme);
    return () => window.removeEventListener('storage', applyTheme);
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/admin/*" // Use /* for nested routes within AdminPortal
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/*" // Use /* for nested routes within TenantPortal
          element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <TenantPortal />
            </ProtectedRoute>
          }
        />

        {/* Redirect root path based on auth/role or to login */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              getUserRole() === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/tenant" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
