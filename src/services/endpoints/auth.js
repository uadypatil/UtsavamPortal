// src/services/endpoints/auth.js
// POST /auth/login, POST /auth/refresh — per Swagger "Auth" section.
import http, { unwrap } from '../httpClient';

/**
 * Login for Users (Super Admin/Affiliate), Event Organizers, and
 * Collection Executives — the Swagger doc explicitly says one endpoint
 * covers all three actor types, and the response is expected to carry
 * which role/type the credentials resolved to.
 */
export async function login({ username, password }) {
  const { data } = await http.post('/auth/login', { username, password });
  return unwrap({ data });
}

export async function refreshSession(refreshToken) {
  const { data } = await http.post('/auth/refresh', { refreshToken });
  return unwrap({ data });
}
