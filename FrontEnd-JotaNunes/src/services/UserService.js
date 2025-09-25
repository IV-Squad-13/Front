import { API_URL } from '../main.jsx';

export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/users`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Falha ao buscar os usuários');
  }

  return data.users;
};

export const updateUser = async (userId, userData) => {
  const response = await fetch(`/mock/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Falha ao atualizar usuário');
  }

  return data.user;
};
