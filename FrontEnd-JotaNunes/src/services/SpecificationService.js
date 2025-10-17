import { API_URL } from '@/main';
import { authFetch } from './AuthService';

export const getAllSpecifications = async () => {
  const data = await authFetch(`${API_URL}/editor/especificacao`);
  return data;
};

export const startProcess = async (data) => {
  const defaultData = {
    initType: 'AVULSO',
  };

  const payload = { ...data, ...defaultData };

  const response = await authFetch(`${API_URL}/editor/empreendimento/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response;
};

export const createSpecification = async (data) => {
  const defaultData = {
    initType: 'AVULSO',
  };

  const payload = {
    ...data,
    ...defaultData,
  };

  const response = await authFetch(`${API_URL}/editor/especificacao/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response;
};
