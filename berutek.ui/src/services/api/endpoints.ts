const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    // Full URLs — used as browser redirect targets (backend handles OIDC redirect)
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    // Relative path — used with the axios client (baseURL already set)
    PROFILE: '/auth/profile',
  },
  LEADS: {
    CREATE: `${API_BASE_URL}/leads`,
  },
} as const;
