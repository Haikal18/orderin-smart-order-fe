/**
 * Token Helper Functions
 * Mengelola penyimpanan Bearer Token (Sanctum) di localStorage
 */

const TOKEN_KEY = 'access_token';
const COOKIE_NAME = 'auth_token';

/**
 * Set cookie manual
 */
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

/**
 * Remove cookie manual
 */
const removeCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

/**
 * Menyimpan token ke localStorage dan Cookie
 * @param token - Bearer token dari Sanctum
 */
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    setCookie(COOKIE_NAME, token);
  }
};

/**
 * Mengambil token dari localStorage
 * @returns Token string atau null jika tidak ada
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Menghapus token dari localStorage dan Cookie
 */
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    removeCookie(COOKIE_NAME);
  }
};

/**
 * Mengecek apakah user sudah terautentikasi
 * @returns true jika token ada, false jika tidak
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};
