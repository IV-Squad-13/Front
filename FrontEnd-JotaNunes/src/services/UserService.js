import { API_URL } from '../main.jsx';
import { authFetch } from './AuthService';

export const getMe = async () => {
  return await authFetch(`${API_URL}/user/auth/me`, {
    method: 'GET'
  });
};

export const getAllUsers = async () => {
  const data = await authFetch(`${API_URL}/user`);

  return data;
};

export const updateUser = async (userId, userData) => {
  const response = await fetch(`${API_URL}/auth/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Falha ao atualizar usuário');
  }

  return data.user;
};
