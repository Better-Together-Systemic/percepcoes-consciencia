import { Navigate, Outlet, useLocation } from 'react-router';
import { useSession } from './api';

export function RequireAuth() {
  const { data: user, isPending } = useSession();
  const location = useLocation();
  if (isPending) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

export function RequireAdmin() {
  const { data: user } = useSession();
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}

export function RedirectIfAuthenticated() {
  const { data: user, isPending } = useSession();
  if (isPending) return null;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}
