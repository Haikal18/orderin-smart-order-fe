/**
 * useAuth Hook
 * Custom hook untuk mengelola authentication state dan actions
 */

'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoginRequest, User } from '@/types/auth/auth.types';
import { authService } from '@/services/auth.service';
import { isAuthenticated as checkAuth, removeToken } from '@/lib/token';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: unknown;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

/**
 * Custom hook untuk authentication menggunakan React Query
 * @returns Object dengan state dan functions untuk auth
 */
export const useAuth = (): UseAuthReturn => {
  const queryClient = useQueryClient();

  // Query untuk mendapatkan current user
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        return await authService.getCurrentUser();
      } catch (err: any) {
        // Jika error 401/403 (Unauthorized/Forbidden), jangan lempar error query
        // tapi kembalikan null agar user dianggap tidak login
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          removeToken();
          return null;
        }
        throw err;
      }
    },
    // Hanya fetch jika ada token di storage
    enabled: checkAuth(),
    retry: false, // Jangan retry jika gagal (terutama auth error)
    staleTime: 5 * 60 * 1000, // Data user dianggap fresh selama 5 menit
  });

  /**
   * Login function
   */
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      // Update cache user dengan data dari response login
      queryClient.setQueryData(['user'], response.user);
    } catch (err) {
      throw err;
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Hapus data user dari cache dan clear token
      queryClient.setQueryData(['user'], null);
      removeToken();
    }
  };

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    logout,
    refetchUser: async () => { await refetch(); },
  };
};
