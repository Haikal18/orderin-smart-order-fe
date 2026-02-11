'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { LoginRequest, User } from '@/types/auth/auth.types';
import { authService } from '@/services/auth.service';
import { isAuthenticated as checkAuth, removeToken } from '@/lib/token';
import { getUser, removeUser } from '@/lib/user';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: unknown;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const cachedUser = getUser();
        if (cachedUser) {
          return cachedUser;
        }
        
        return await authService.getCurrentUser();
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          removeToken();
          removeUser();
          return null;
        }
        throw err;
      }
    },

    enabled: checkAuth(),
    retry: false, 
    staleTime: 5 * 60 * 1000, 
  });


  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);

      queryClient.setQueryData(['user'], response.data);
    } catch (err) {
      throw err;
    }
  };


  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      queryClient.setQueryData(['user'], null);
      removeToken();
      removeUser();


      router.replace('/');
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
