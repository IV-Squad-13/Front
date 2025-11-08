import { API_URL } from '@/main';
import { authFetch } from './AuthService';

export const getAllSpecifications = async () => {
    const queryParams = new URLSearchParams({
    loadEspecificacao: true,
    loadMateriais: true,
    loadMarcas: true,
    loadLocais: true,
    loadAmbientes: true,
    loadItems: true,
    loadNested: true,
    loadPadrao: true,
    loadUsers: true,
  }).toString();

  const data = await authFetch(`${API_URL}/editor/especificacao?${queryParams}`);
  return data;
};

export const getAllEmpreendimentos = async () => {
    const queryParams = new URLSearchParams({
    loadEspecificacao: true,
    loadMateriais: true,
    loadMarcas: true,
    loadLocais: true,
    loadAmbientes: true,
    loadItems: true,
    loadNested: true,
    loadPadrao: true,
    loadUsers: true,
  }).toString();


  const data = await authFetch(`${API_URL}/editor/empreendimento?${queryParams}`);
  return data;
};


export const startProcess = async (data) => {
  const defaultData = {
    init: 'AVULSO',
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

export const updateSpecification = async (data, id) => {
  const response = await authFetch(`${API_URL}/editor/especificacao/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response;
};

export const addDocElement = async (data, specId) => {
  const response = await authFetch(`${API_URL}/editor/document/${specId}/catalog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return response;
}

export const addDocElementBulk = async (data, specId) => {
  const response = await authFetch(`${API_URL}/editor/document/${specId}/catalog/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response;
};

export const addRawDocElement = async (data, specId) => {
  const response = await authFetch(`${API_URL}/editor/document/${specId}/raw`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response;
};
