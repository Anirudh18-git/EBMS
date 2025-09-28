import { API_BASE_URL } from '../constants';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token'); // Assuming JWT stored as 'token'
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ msg: response.statusText }));
    throw new Error(errorData.msg || `API Error: ${response.statusText}`);
  }
  return response.json();
};
