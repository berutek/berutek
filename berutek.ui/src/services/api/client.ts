import axios, { AxiosInstance } from 'axios';
import { API_ENDPOINTS } from './endpoints';

class ApiClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api/v1',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true, // sends the session cookie on every request
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          window.location.href = API_ENDPOINTS.AUTH.LOGIN;
        }
        return Promise.reject(error);
      }
    );
  }

  getInstance(): AxiosInstance {
    return this.client;
  }
}

export default new ApiClient();
