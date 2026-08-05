const STORAGE_KEY = 'ep_auth';

/**
 * Centralized auth state — reads/writes a single JSON blob in localStorage
 * instead of scattering raw localStorage.getItem/setItem calls across
 * SignIn, PrivateRoute, and LogOut.
 *
 * This intentionally keeps the same underlying behavior those three files
 * already had (a simple "isLoggedIn" flag) while also capturing the user's
 * role, which the API already returns but the app was previously discarding —
 * useful for the sidebar/nav and any future role-based route guarding.
 */
export function useAuth() {
    const login = ({ role, username } = {}) => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ isLoggedIn: true, role: role || null, username: username || null })
        );
        // Kept for backward compatibility with any code still checking this directly.
        localStorage.setItem('isLoggedIn', 'true');
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('isLoggedIn');
    };

    const getAuth = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            // fall through to legacy check below
        }
        // Legacy fallback for sessions started before this hook existed.
        return { isLoggedIn: !!localStorage.getItem('isLoggedIn'), role: null, username: null };
    };

    const isAuthenticated = () => !!getAuth().isLoggedIn;
    const getRole = () => getAuth().role;

    return { login, logout, getAuth, isAuthenticated, getRole };
}

export default useAuth;
