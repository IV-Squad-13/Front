import { API_URL } from '../main.jsx';

export const getCatalogBySpec = async (spec = 'ambiente') => {
  const response = await fetch(`${API_URL}/catalogo/${spec}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Falha ao buscar dados: ${spec}`);
  }
  return data;
};