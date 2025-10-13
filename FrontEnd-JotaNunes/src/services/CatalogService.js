import { API_URL } from '../main.jsx';
import { authFetch } from './AuthService';

export const getCatalogByResource = async (resource = 'ambiente') => {
  const response = await authFetch(`${API_URL}/catalogo/${resource}`, {
    method: 'GET'
  });

  const data = response;

  if (!response) {
    throw new Error(data.error || `Falha ao buscar dados: ${resource}`);
  }

  return data;
};