import api from '@/lib/api';
import { setToken, removeToken } from '@/lib/token';
import { getErrorMessage } from '@/lib/error';
import { LoginRequest, LoginResponse, User, ApiResponse } from '@/types/auth/auth.types';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/login', credentials);
      const { token } = response.data.data;
      setToken(token);
      return response.data.data;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Login gagal');
      throw new Error(message);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/logout');
      removeToken();
    } catch (error: unknown) {
      removeToken();
      const message = getErrorMessage(error, 'Logout gagal');
      throw new Error(message);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>('/user');
      return response.data.data;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Gagal mengambil data user');
      throw new Error(message);
    }
  }
}

export const authService = new AuthService();
