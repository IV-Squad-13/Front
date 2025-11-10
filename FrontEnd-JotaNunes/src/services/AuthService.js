import { API_URL } from '../main.jsx';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/user/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  // Pega o token como texto (não JSON)
  const token = await response.text();

  if (!response.ok) {
    throw new Error('Falha no login');
  }

  // 🔹 Valida se o token parece um JWT
  if (!token.startsWith('ey')) {
    console.error('Resposta inesperada no login:', token);
    throw new Error('Resposta inválida do servidor');
  }

  // 🔹 Salva corretamente no localStorage
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

  // 🔹 Aqui o erro mais comum:
  // O back-end pode retornar texto, JSON, ou nada — vamos proteger
  let data;
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Falha na requisição');
  }

  return data;
};
