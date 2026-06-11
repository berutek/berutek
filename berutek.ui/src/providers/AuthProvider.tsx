'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@store/authStore';
import apiClient from '@services/api/client';
import { API_ENDPOINTS } from '@services/api/endpoints';
import type { User } from '../types/auth.types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    apiClient.getInstance()
      .get<User>(API_ENDPOINTS.AUTH.PROFILE)
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        clearAuth();
      });
  }, [setUser, clearAuth]);

  return <>{children}</>;
}
