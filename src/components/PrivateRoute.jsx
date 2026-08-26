// components/PrivateRoute.jsx
//
// SECURITY NOTE: this guard is a UI convenience only. It prevents a
// logged-out (or wrong-role) user from *seeing* a page and stops obviously
// unauthorized navigation, which matters for UX and for not leaking page
// structure. It does NOT make the app secure by itself — every API call
// this app makes still goes through the bearer token (see
// services/httpClient.js), and the backend must independently re-check
// authorization on every request. A user editing localStorage to claim a
// role they don't have will still get 401/403s from the real API; this
// guard just avoids rendering a page that would immediately fail anyway.
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * @param {string[]} [roles] - if provided, the signed-in user's role must
 *   be one of these, otherwise they're redirected to a safe landing page
 *   for their actual role (or /signin if not authenticated at all).
 */
const PrivateRoute = ({ children, roles }) => {
    const { isAuthenticated, getRole, getUser } = useAuth();
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/signin" replace state={{ from: location }} />;
    }

    if (roles && roles.length > 0) {
      const user = getUser();
      const role = getRole() || user.actorType;
        if (!roles.includes(role)) {
            const fallback =
                role === 'SUPER_ADMIN' ? '/superadmin/dashboard' :
                role === 'EVENT_ORGANIZER' ? '/admin/dashboard' :
                role === 'COLLECTION_EXECUTIVE' ? '/em/dashboard' :
                '/signin';
            return <Navigate to={fallback} replace />;
        }
    }

    return children;
};

export default PrivateRoute;
