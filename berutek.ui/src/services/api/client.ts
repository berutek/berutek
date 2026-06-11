import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

class ApiClient{
    private client: AxiosInstance;
    
    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        })
        this.setupInterceptors();
    }

    setupInterceptors() {
        this.client.interceptors.request.use((config:InternalAxiosRequestConfig) => {
            const token = this.getToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        }, error => {
            console.log("Request error:", error);
            
            return Promise.reject(error);
        });

        this.client.interceptors.response.use(response => {
            return response;
        }, error => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        });
    }

    getToken() {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('accessToken');
    }
    getInstance(){
        return this.client;
    }
}

export default new ApiClient();