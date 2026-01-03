const BASE_URL = import.meta.env?.VITE_API_BASE || 'http://localhost:5000/api/v1';

export function saveToken(token) {
  if (!token) return;
  try {
    localStorage.setItem('token', token);
    try {
      // Also set a non-HttpOnly cookie named `token` so servers expecting cookie auth receive it.
      // Expires in 7 days by default.
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `token=${token}; expires=${expires}; path=/`;
    } catch (e) {
      // document may be undefined in certain SSR contexts; ignore
    }
  } catch (e) {
    console.warn('Failed to save token', e);
  }
}

export function getToken() {
  try {
    return localStorage.getItem('token');
  } catch (e) {
    return null;
  }
}

export function removeToken() {
  try {
    localStorage.removeItem('token');
    try {
      // remove cookie
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    } catch (e) {}
  } catch (e) {
    console.warn('Failed to remove token', e);
  }
}

export function authHeader() {
  const token = getToken();
  const header = token ? { Authorization: `Bearer ${token}` } : {};
  if (token) console.log('[auth.authHeader] token present, Authorization header set');
  return header;
}

export default {
  BASE_URL,
  saveToken,
  getToken,
  removeToken,
  authHeader,
};
