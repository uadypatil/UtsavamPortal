import { useCallback, useEffect, useState } from 'react';
import { tokenStore, onSessionExpired } from '../services/httpClient';
import { login as loginRequest } from '../services/endpoints/auth';

const USER_KEY = 'ep_auth_user';

/**
 * Auth lifecycle built around the real backend (POST /auth/login,
 * POST /auth/refresh — see services/endpoints/auth.js). Replaces the old
 * version that stored only a boolean + role string with no token model.
 *
 * IMPORTANT (see PrivateRoute.jsx / SECURITY note): everything this hook
 * exposes is a *client-side convenience* for routing/UI decisions only.
 * The backend remains the source of truth for authorization — every
 * protected API call still carries the bearer token and the server
 * decides whether it's actually allowed, regardless of what a user edits
 * in localStorage.
 */
function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Simple event bus so every useAuth() consumer re-renders when auth state
// changes anywhere (login in one component, session-expiry from the http
// interceptor, logout from another component), without needing a Context
// provider rewrite of the whole app in this pass.
const listeners = new Set();
function broadcast() {
  listeners.forEach((fn) => fn());
}

export function useAuth() {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    const onChange = () => setUser(readStoredUser());
    listeners.add(onChange);
    const unsubscribeExpired = onSessionExpired(() => {
      localStorage.removeItem(USER_KEY);
      onChange();
    });
    return () => {
      listeners.delete(onChange);
      unsubscribeExpired();
    };
  }, []);

  const login = useCallback(async ({ username, password }) => {
    const result = await loginRequest({ username, password });
    // Response shape isn't confirmed by the available doc extract (the
    // Schemas section wasn't rendered) — this accepts the two most likely
    // shapes so it degrades gracefully rather than silently failing.
    const accessToken = result?.accessToken || result?.token;
    const refreshToken = result?.refreshToken;
    const account = result?.user || result?.account || result || {};
    const role = account?.role || result?.role || null;

    if (!accessToken) {
      throw new Error('Login response did not include an access token.');
    }

    tokenStore.setTokens({ accessToken, refreshToken });
    const nextUser = {
      role,
      username: account?.username || username,
      id: account?.id || account?._id || null,
      name: account?.name || account?.fullName || null,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    broadcast();
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    localStorage.removeItem(USER_KEY);
    // Legacy keys from the pre-JWT auth model — cleared so a stale flag
    // can never grant a false-positive `isAuthenticated()`.
    localStorage.removeItem('ep_auth');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    broadcast();
  }, []);

  const isAuthenticated = useCallback(() => !!tokenStore.getAccessToken() && !!readStoredUser(), []);
  const getRole = useCallback(() => readStoredUser()?.role || null, []);
  const getUser = useCallback(() => readStoredUser(), []);

  return { user, login, logout, isAuthenticated, getRole, getUser };
}

export default useAuth;
