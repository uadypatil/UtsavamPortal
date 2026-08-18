// src/services/httpClient.js
//
// Central axios instance for the Utsavam Portal API (see Swagger_UI.pdf —
// "Utsavam Portal API" OAS 3.0, base path /api/v1). This is the ONLY place
// that should know about the access/refresh token lifecycle; every
// src/services/endpoints/*.js file should import `http` from here instead
// of calling axios directly.
//
// NOTE ON API MIGRATION: the legacy `services/api.js` (`load`/`save`) talks
// to a different, non-REST backend (api_url in config/apiConfig.js, e.g.
// `Event/get`, `CollectionExecutive/getBy/...`). That file is left in place
// for any screen not yet migrated, but all new/updated modules in this pass
// use this REST client against the Swagger contract instead.

import axios from 'axios';

// Swagger doc lists `http://localhost:5002/api/v1` as the (local dev)
// server. Kept overridable via Vite env so this isn't hardcoded for
// whoever deploys the real backend.
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5002/api/v1';

const ACCESS_TOKEN_KEY = 'ep_access_token';
const REFRESH_TOKEN_KEY = 'ep_refresh_token';

export const tokenStore = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: ({ accessToken, refreshToken } = {}) => {
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- 401 handling with a single in-flight refresh, queueing concurrent
// requests that fail while the refresh is happening, so a page that fires
// several requests at once doesn't trigger several parallel refresh calls.
let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

// Listeners the app (useAuth) can subscribe to, so a hard/unrecoverable
// auth failure (refresh itself fails) can clear state and redirect to
// /signin from one place instead of every single API call site.
const sessionExpiredListeners = new Set();
export function onSessionExpired(listener) {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
}
function notifySessionExpired() {
  sessionExpiredListeners.forEach((fn) => {
    try { fn(); } catch { /* listener errors shouldn't break the chain */ }
  });
}

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const status = response?.status;

    // Never try to refresh for the auth endpoints themselves — avoids loops.
    const isAuthEndpoint = config?.url?.includes('/auth/login') || config?.url?.includes('/auth/refresh');

    if (status === 401 && !config?._retry && !isAuthEndpoint && tokenStore.getRefreshToken()) {
      if (isRefreshing) {
        // Queue this request until the in-flight refresh resolves.
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((newToken) => {
          config._retry = true;
          config.headers.Authorization = `Bearer ${newToken}`;
          return http(config);
        });
      }

      config._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStore.getRefreshToken();
        // Deliberately uses a bare axios call (not `http`) to avoid
        // recursing into this same interceptor.
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const newAccessToken = data?.data?.accessToken || data?.accessToken;
        const newRefreshToken = data?.data?.refreshToken || data?.refreshToken;

        tokenStore.setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        flushQueue(null, newAccessToken);

        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return http(config);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        tokenStore.clear();
        notifySessionExpired();
        return Promise.reject(refreshError);
      } finally {        isRefreshing = false;
      }
    }

    // Refresh itself failed, or there was no refresh token to try —
    // treat as a hard session expiry so the app can redirect to /signin.
    if (status === 401 && (isAuthEndpoint || !tokenStore.getRefreshToken())) {
      if (!isAuthEndpoint) {
        tokenStore.clear();
        notifySessionExpired();
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Normalizes the ApiResponse / ApiError envelope described in the Swagger
 * doc's Schemas section. We don't have the exact field names from the PDF
 * (the schema bodies weren't included in the extract), so this makes the
 * minimum reasonable assumption — a `data` (or `response`) payload on
 * success and a `message` on failure — and every endpoint module below
 * funnels through it. If the real backend's envelope differs, this is the
 * one place to correct it.
 */
export function unwrap(response) {
  const body = response?.data;
  if (body && typeof body === 'object' && 'data' in body) return body.data;
  if (body && typeof body === 'object' && 'response' in body) return body.response;
  return body;
}

export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export default http;
