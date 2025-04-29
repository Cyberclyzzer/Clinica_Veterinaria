import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { UserRole } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, user, loading, fetchUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      fetchUser();
    }
  }, [isAuthenticated, loading, fetchUser]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user doesn't have the required role
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    const redirectPath = user.role === UserRole.OWNER ? '/owner' : 
                        (user.role === UserRole.STAFF || user.role === UserRole.ADMIN) ? '/staff' : 
                        '/login';
    
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;