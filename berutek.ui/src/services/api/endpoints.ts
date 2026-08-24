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
    // Full URL — called server-side from the /api/contact route
    CREATE: `${API_BASE_URL}/leads`,
  },
  BLOGS: {
    // Relative paths — called directly from the browser via the axios client,
    // so the session cookie reaches the API host (a Next proxy would strip it
    // in production, where the frontend and API live on different hosts)
    LIST: '/blogs',
    BY_ID: (id: string) => `/blogs/${encodeURIComponent(id)}`,
  },
} as const;
