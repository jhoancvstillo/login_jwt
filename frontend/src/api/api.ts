// api.ts
import axios, {
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
  } from 'axios';
  
  export const API_URL = 'http://localhost:8000/api';
  
  const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });
  
  // INTERCEPTOR #1: Adjuntar el access token antes de cada petición
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('access_token');
      console.log("El access token es: ", token);
      if (token) {
        // Adjuntar token en la cabecera "Authorization"
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
  
  // Manejo centralizado de respuestas con error 401 (token expirado)
  // Con rotación activada, llamamos /refresh/ para obtener un nuevo token
  let isRefreshing = false;
  interface FailedRequest {
    resolve: (value: string | PromiseLike<string>) => void;
    reject: (reason?: any) => void;
  }
  let failedQueue: FailedRequest[] = [];
  
  // Procesar la cola de peticiones que estaban esperando a que termine el refresh
  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token as string);
      }
    });
    failedQueue = [];
  };
  
// INTERCEPTOR #2: Manejar errores 401 (token expirado)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }).catch(err => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const response = await api.post('/refresh/');
      const newAccessToken = response.data.access;
      localStorage.setItem('access_token', newAccessToken);

      // Crear nueva configuración con headers actualizados
      const newConfig = {
        ...originalRequest,
        headers: {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`
        }
      };

      processQueue(null, newAccessToken);
      return api(newConfig); // Usar la nueva configuración
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
  
  export default api;
  