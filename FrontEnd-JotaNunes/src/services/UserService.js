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

// usa o método do backend para puxar usuários do banco pela sua role (papel).

export const getUsersByRole = async (role) => {
  const data = await authFetch(`${API_URL}/user/papel/${role.toUpperCase()}`, {
    method: 'GET'
  });
  return data;
}

const adaptData = (data) => {
  const payload = {};
  if (data.name !== undefined) payload.nome = data.name;
  if (data.email !== undefined) payload.email = data.email;
  if (data.password !== undefined) payload.senha = data.password;
  if (data.role !== undefined) payload.papel = data.role;
  return payload;
};

export const updateUser = async (userId, userData) => {

  const payload = adaptData(userData)

  const updatedUser = await authFetch(`${API_URL}/user/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

  return updatedUser;
};

export const createUser = async (userData) => {
  const payload = adaptData(userData)

  const createUser = await authFetch(`${API_URL}/user/auth/register`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return createUser;
};

export const deleteUser = async (id) => {
  return await authFetch(`${API_URL}/user/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}