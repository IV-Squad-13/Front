import { API_URL } from '@/main';
import { authFetch } from './AuthService';

export const searchEmpreendimentos = async (searchParams) => {
  const queryParams = new URLSearchParams({ ...searchParams, loadAll: true }).toString();
  return await authFetch(`${API_URL}/editor/empreendimento/search?${queryParams}`);
}

export const searchEspecificacao = async (searchParams) => {
  const queryParams = new URLSearchParams({ ...searchParams, loadAll: true }).toString();
  return await authFetch(`${API_URL}/editor/especificacao/search?${queryParams}`)
}

export const searchDocElement = async (searchParams) => {
  const queryParams = new URLSearchParams({ ...searchParams, loadAll: true }).toString();
  return await authFetch(`${API_URL}/editor/document/search?${queryParams}`)
}


export const getAllSpecifications = async () => {
  const queryParams = new URLSearchParams({ loadAll: true }).toString();

  const data = await authFetch(`${API_URL}/editor/especificacao?${queryParams}`);
  return data;
};

export const getAllEmpreendimentos = async () => {
  return await authFetch(`${API_URL}/editor/empreendimento`);
};

export const getEmpreendimentoById = async (id, docLoadParams) => {
  const queryParams = new URLSearchParams({ loadAll: true, loadPadrao: true, ...docLoadParams }).toString();

  return await authFetch(`${API_URL}/editor/empreendimento/${id}?${queryParams}`);
}

export const startProcess = async (data) => {
  const response = await authFetch(`${API_URL}/editor/empreendimento/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response;
};

export const updateEmpreendimento = async (id, data, docLoadParams) => {
  const queryParams = new URLSearchParams({ loadAll: true, ...docLoadParams }).toString();

  const response = await authFetch(`${API_URL}/editor/empreendimento/${id}?${queryParams}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return response;
}

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

export const updateDocElement = async (id, data) => {
  return await authFetch(`${API_URL}/editor/document/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export const deleteDocElement = async (id, docType) => {
  const queryParams = new URLSearchParams({ docType }).toString();

  return await authFetch(`${API_URL}/editor/document/${id}?${queryParams}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const deleteEmp = async (id) => {
  return await authFetch(`${API_URL}/editor/empreendimento/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}