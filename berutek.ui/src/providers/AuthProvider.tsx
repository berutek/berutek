'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@store/authStore';
import apiClient from '@services/api/client';
import { API_ENDPOINTS } from '@services/api/endpoints';
import type { User } from '../types/auth.types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearAuth } = useAuthStore();

  useEffect(() => {
    apiClient.getInstance()
      .get<User | { message: string }>(API_ENDPOINTS.AUTH.PROFILE)
      .then((res) => {
        console.log('AuthProvider: Profile response:', res.data); // Log the response data for debugging
        // The profile endpoint returns { message: 'Not authenticated' } when no session exists
        if ('username' in res.data) {
          setUser(res.data as User);
        }
      })
      .catch(() => clearAuth());
  }, [setUser, clearAuth]);

  return <>{children}</>;
}
