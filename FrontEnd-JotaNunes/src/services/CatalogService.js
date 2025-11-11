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

export const getItemTypes = async () => {
  const data = await getCatalogByResource('item-types');
  return data;
};

export const postCatalogByResource = async (resource, resourceData) => {
  resourceData.isActive = true;
  const requiredFields = {
    item: ['name','type','desc'],
    ambiente: ['name', 'local'],
    padrao: ['name'],
    material: ['name'],
    marca: ['name'],
    item_type: ['name', 'type', 'desc']
  }

  requiredFields[resource].forEach(field => {
    if (!resourceData[field]) console.error("Campo obrigatório não preenchido");
    else console.log('campo: ' + field + ' = ' + resourceData[field])
  });

  const response = await authFetch(`${API_URL}/catalogo/${resource}/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resourceData)
  });

  const data = response;

  if (!response) {
    throw new Error(data.error || `Falha ao buscar dados: ${resource}`);
  }

  return data;
};