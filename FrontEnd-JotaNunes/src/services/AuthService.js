import { API_URL } from '../main.jsx';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const token = await response.text();

  if (!response.ok) {
    throw new Error(token.error || 'Falha no login');
  }

  localStorage.setItem('bearerToken', token);
};

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('bearerToken');

  const headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error('Falha na requisição');
  }

  return response.json();
};
