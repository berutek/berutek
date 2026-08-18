import { useCallback } from 'react';
import { useAuthStore } from '@store/authStore';
import { API_ENDPOINTS } from '@services/api/endpoints';

export function useAuth() {
  const { user, isAuthenticated } = useAuthStore();

  const login = useCallback(() => {
    window.location.href = API_ENDPOINTS.AUTH.LOGIN;
  }, []);

  const logout = useCallback(() => {
    window.location.href = API_ENDPOINTS.AUTH.LOGOUT;
  }, []);

  return { user, isAuthenticated, login, logout };
}
