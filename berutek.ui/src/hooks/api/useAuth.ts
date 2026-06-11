import { useCallback } from 'react';
import { useMutation } from './useMutation';
import { useAuthStore } from '@store/authStore';
import { API_ENDPOINTS } from '@services/api/endpoints';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../../types/auth.types';

export function useAuth() {
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();

  const loginMutation = useMutation<AuthResponse, LoginPayload>(
    { method: 'POST', url: API_ENDPOINTS.AUTH.LOGIN },
    {
      onSuccess: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
      },
    }
  );

  const registerMutation = useMutation<AuthResponse, RegisterPayload>(
    { method: 'POST', url: API_ENDPOINTS.AUTH.REGISTER },
    {
      onSuccess: (data) => {
        console.log("Registration successful, received data:", data);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
      },
    }
  );

  const login = useCallback(
    (credentials: LoginPayload) => loginMutation.mutate(credentials),
    [loginMutation]
  );

  const register = useCallback(
    (payload: RegisterPayload) => registerMutation.mutate(payload),
    [registerMutation]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    clearAuth();
  }, [clearAuth]);

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loading: loginMutation.loading || registerMutation.loading,
    error: loginMutation.error ?? registerMutation.error,
  };
}