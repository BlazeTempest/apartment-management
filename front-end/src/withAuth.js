import React from 'react';
import { useAuth } from './hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function withAuth(Component, { expectedRole }) {
  function AuthenticatedComponent(props) {
    const { user } = useAuth();

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (expectedRole && !user.roles?.includes(expectedRole)) {
      if (user.roles?.includes('ROLE_ADMIN')) {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (user.roles?.includes('ROLE_TENANT')) {
        return <Navigate to="/tenant/dashboard" replace />;
      }
      return <Navigate to="/login" replace />;
    }

    return <Component {...props} />;
  }

  return AuthenticatedComponent;
}
