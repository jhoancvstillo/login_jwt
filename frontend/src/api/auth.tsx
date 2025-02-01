import api, { API_URL } from './api';

export interface RegisterProps {
  username: string;
  password: string;
  email: string;
}

export interface LoginProps {
  username: string;
  password: string;
}

export interface LoginResponseProps {
  access: string;
  refresh?: string; // Dependiendo de tu backend, podría venir o no
}

export async function registerUser(data: RegisterProps) {
  const response = await api.post(`${API_URL}/register/`, data);
  return response.data;
}

export async function loginUser(credentials: LoginProps) {
  const response = await api.post<LoginResponseProps>(`${API_URL}/login/`, credentials);
  return response.data;
}

export async function profileUser() {
  const response = await api.get(`${API_URL}/profile/`);
  return response.data;
}

export async function logoutUser() {
  const response = await api.post(`${API_URL}/logout/`);
  return response.data;
}