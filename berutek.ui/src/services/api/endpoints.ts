const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    PROFILE: '/auth/me',
  },
  USERS: {
    LIST: '/users',
    GET: (id: string) => `/users/${id}`,
  },
};