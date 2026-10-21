import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../api/authClient';
import GlobalLoader from './GlobalLoader';

export default function ProtectedRoute({ allowedRoles }) {
  const { data: session, isPending } = useSession();

  // 1. While waiting for the backend to confirm who this is, show a loading screen
  if (isPending) {
    return <GlobalLoader />;
  }

  // 2. If they are not logged in at all, kick them to the login page
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 3. If the route requires a specific role (like 'ADMIN'), check if they have it
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = session.user.role?.toUpperCase() || 'CUSTOMER';
    
    if (!allowedRoles.includes(userRole)) {
      // If they are a CUSTOMER trying to access an ADMIN route, kick them to the storefront
      return <Navigate to="/" replace />;
    }
  }

  // 4. If they pass all checks, let them render the page!
  return <Outlet />;
}