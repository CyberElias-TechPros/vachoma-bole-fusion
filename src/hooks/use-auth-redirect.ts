
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function useAuthRedirect() {
  const { isAuthenticated, loading, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    // If not authenticated and on protected route, redirect to login
    const protectedRoutes = ['/client', '/dashboard', '/fashion', '/food'];
    const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
    
    if (!isAuthenticated && isProtectedRoute) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // If authenticated and on login/signup, redirect based on role
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
      const from = location.state?.from?.pathname;
      
      if (from) {
        navigate(from);
      } else if (profile?.role === 'admin' || profile?.role === 'manager' || profile?.role === 'staff') {
        navigate('/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    }
  }, [isAuthenticated, loading, location, navigate, profile]);

  return { isAuthenticated, loading, profile };
}
