import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from './use-auth';

/**
 * @description This component uses the `useAuth` hook to check if a user is authenticated.
 * If the authentication status is null (indicating loading or uninitialized state), it renders nothing
 * temporarily, allowing for the implementation of a loading spinner in the future. If the user is not authenticated,
 * it redirects to the signin page. For authenticated users, it renders the child routes using the `Outlet` component.
 *
 * @returns {JSX.Element|null} A JSX element for route handling or null during loading.
 *
 * @function PrivateRoutes
 */
export function PrivateRoutes() {
  const location = useLocation();

  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    /* ToDp implement isAuthenticating for loading spinner */
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
