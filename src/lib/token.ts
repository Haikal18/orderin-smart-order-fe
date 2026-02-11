
import { getCookie, setCookie as setNextCookie, deleteCookie } from 'cookies-next';

const COOKIE_NAME = 'auth_token';


export const setToken = (token: string): void => {
  setNextCookie(COOKIE_NAME, token, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax',
  });
};


export const getToken = (): string | null => {
  const token = getCookie(COOKIE_NAME);
  return token ? String(token) : null;
};


export const removeToken = (): void => {
  deleteCookie(COOKIE_NAME);
};


export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};
