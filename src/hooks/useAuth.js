import { useCallback, useEffect, useState } from 'react';
import { tokenStore, onSessionExpired } from '../services/httpClient';
import { login as loginRequest } from '../services/endpoints/auth';

const USER_KEY = 'ep_auth_user';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const listeners = new Set();

function broadcast() {
  listeners.forEach((fn) => fn());
}

export function useAuth() {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    const onChange = () => {
      setUser(readStoredUser());
    };

    listeners.add(onChange);

    const unsubscribeExpired = onSessionExpired(() => {
      tokenStore.clear();

      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('ep_auth');
      localStorage.removeItem('isLoggedIn');

      onChange();
      broadcast();
    });

    return () => {
      listeners.delete(onChange);
      unsubscribeExpired();
    };
  }, []);

  const login = useCallback(async ({ username, password }) => {
    const result = await loginRequest({
      username,
      password,
    });

    /*
     * Support both:
     *
     * 1. loginRequest() returns:
     *    {
     *      accessToken,
     *      refreshToken,
     *      actor
     *    }
     *
     * 2. loginRequest() returns:
     *    {
     *      success: true,
     *      message: "...",
     *      data: {
     *        accessToken,
     *        refreshToken,
     *        actor
     *      }
     *    }
     */

    const data = result?.data?.accessToken
      ? result.data
      : result;

    if (!data) {
      throw new Error('Invalid login response from server.');
    }

    const accessToken = data?.accessToken;
    const refreshToken = data?.refreshToken;
    const account = data?.actor || {};

    if (!accessToken) {
      throw new Error(
        'Login response did not include an access token.'
      );
    }

    if (!account?.id) {
      throw new Error(
        'Login response did not include actor information.'
      );
    }

    const role = account?.role || null;

    /*
     * Store JWT tokens.
     */
    tokenStore.setTokens({
      accessToken,
      refreshToken,
    });

    /*
     * Store frontend user information.
     */
    const nextUser = {
      id: account?.id || null,
      role,
      name: account?.fullName || null,
      username: account?.username || username,
      actorType: account?.actorType || null,
      seasonId: account?.seasonId || null,
      eventId: account?.eventId || null,
    };

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(nextUser)
    );

    /*
     * Update React state.
     */
    setUser(nextUser);

    /*
     * Notify every useAuth() instance.
     */
    broadcast();

    return nextUser;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();

    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('ep_auth');
    localStorage.removeItem('isLoggedIn');

    setUser(null);
    broadcast();
  }, []);

  const isAuthenticated = useCallback(() => {
    const accessToken = tokenStore.getAccessToken();
    const storedUser = readStoredUser();

    return Boolean(accessToken && storedUser);
  }, []);

  const getRole = useCallback(() => {
    return readStoredUser()?.role || null;
  }, []);

  const getUser = useCallback(() => {
    return readStoredUser();
  }, []);

  return {
    user,
    login,
    logout,
    isAuthenticated,
    getRole,
    getUser,
  };
}

export default useAuth;
