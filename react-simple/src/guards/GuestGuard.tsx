import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
import AuthService from '../services/auth.service';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    const user = AuthService.getCurrentUser();
    if (user.role === 'ROLE_USER') {
      return <Navigate to={'/analytics'} />;
    } else {
      return <Navigate to={PATH_DASHBOARD.root} />;
    }
  }

  return <>{children}</>;
}
