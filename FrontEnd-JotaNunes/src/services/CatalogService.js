import { API_URL } from '../main.jsx';
import { authFetch } from './AuthService';

const firstExisting = (obj, alternatives = [], fallback = []) => {
  for (const name of alternatives) {
    if (!obj) continue;
    if (Object.prototype.hasOwnProperty.call(obj, name) && obj[name] != null) {
      return obj[name];
    }
  }
  return fallback;
};

const toArray = (maybe) => {
  if (!maybe) return [];
  if (Array.isArray(maybe)) return maybe;

  if (maybe instanceof Set) return Array.from(maybe);

  if (typeof maybe === 'object') {
    try {
      return Array.from(Object.values(maybe));
    } catch {
      return [];
    }
  }
  return [];
};

export const getCatalogByResource = async (resource = 'padrao') => {
  const query = new URLSearchParams({ ['loadAll']: true }).toString();

  const response = await authFetch(`${API_URL}/catalogo/${resource}?${query}`, {
    method: 'GET',
  });

  if (!response) {
    throw new Error(`Falha ao buscar dados de: ${resource}`);
  }

  return response;
};

export const getAmbienteById = async (resource = 'ambiente') => {
  const query = new URLSearchParams({ ['loadAll']: true }).toString();

  const response = await authFetch(`${API_URL}/catalogo/${resource}?${query}`, {
    method: 'GET',
  });

  if (!response || response.error) {
    throw new Error(response?.error || `Falha ao buscar o ambiente ID ${resource}`);
  }

  return {
    ...response,
    locais: response.local ? [response.local] : [],
    padroes: toArray(firstExisting(response, ['padraoSet', 'padrao_list', 'padraoList', 'padroes', 'padrao'])) ,
    itens: toArray(firstExisting(response, ['itemSet', 'item_list', 'itemList', 'itens', 'item'])) ,
  };
};

export const getMaterialById = async (id) => {
  const query = new URLSearchParams({ ['loadAll']: true }).toString();

  const response = await authFetch(`${API_URL}/catalogo/material/${id}?${query}`, {
    method: 'GET',
  });

  if (!response || response.error) {
    throw new Error(response?.error || `Falha ao buscar o material ID ${id}`);
  }

  return {
    ...response,
    padroes: toArray(firstExisting(response, ['padraoSet', 'padrao_list', 'padraoList', 'padroes'])),
    marcas: toArray(firstExisting(response, ['marcaSet', 'marca_list', 'marcaList', 'marcas'])),
  };
};

export const getItemById = async (id) => {
  const query = new URLSearchParams({ ['loadAll']: true }).toString();

  const response = await authFetch(`${API_URL}/catalogo/item/${id}?${query}`, {
    method: 'GET',
  });

  if (!response || response.error) {
    throw new Error(response?.error || `Falha ao buscar o item ID ${id}`);
  }

  const descricao = response.descricao ?? response.description ?? response.desc ?? null;
  const tipo = response.tipo ?? response.type ?? null;

  return {
    ...response,
    descricao,
    tipo,
    padroes: toArray(firstExisting(response, ['padraoSet', 'padrao_list', 'padraoList', 'padroes'])),
    ambientes: toArray(firstExisting(response, ['ambienteSet', 'ambiente_list', 'ambienteList', 'ambientes'])),
  };
};

export const getMarcaById = async (id) => {
  const query = new URLSearchParams({ ['loadAll']: true }).toString();

  const response = await authFetch(`${API_URL}/catalogo/marca/${id}?${query}`, {
    method: 'GET',
  });

  if (!response || response.error) {
    throw new Error(response?.error || `Falha ao buscar a marca ID ${id}`);
  }

  return {
    ...response,
    padroes: toArray(firstExisting(response, ['padraoSet', 'padrao_list', 'padraoList', 'padroes'])),
    materiais: toArray(firstExisting(response, ['materialSet', 'material_list', 'materialList', 'materiais'])),
  };
};

export const getCatalogItemById = async (type, id) => {
  const query = new URLSearchParams({ ['loadAll']: true }).toString();

  const mainResponse = await authFetch(`${API_URL}/catalogo/${type}/${id}?${query}`, {
    method: 'GET',
  });

  if (!mainResponse || mainResponse.error) {
    throw new Error(mainResponse?.error || `Falha ao buscar detalhes do item: ${type}/${id}`);
  }

  try {
    switch (type) {
      case 'padrao': {
        const [ambientesRes, materiaisRes] = await Promise.all([
          authFetch(`${API_URL}/catalogo/padrao/${id}/ambiente`, { method: 'GET' }),
          authFetch(`${API_URL}/catalogo/padrao/${id}/material`, { method: 'GET' }),
        ]);

        const ambientes = toArray(ambientesRes);
        const materiais = toArray(materiaisRes);

        return {
          ...mainResponse,
          ambientes: ambientes || [],
          itens: ambientes.flatMap(a => toArray(firstExisting(a, ['itemList', 'item_set', 'itemSet', 'itens', 'items']))),
          materiais: materiais || [],
          marcas: materiais.flatMap(m => toArray(firstExisting(m, ['marcaList', 'marca_set', 'marcaSet', 'marcas']))),
        };
      }

      case 'ambiente': {

        return await getAmbienteById(id);
      }

      case 'material': {
        return await getMaterialById(id);
      }

      case 'item': {
        return await getItemById(id);
      }

      case 'marca': {
        return await getMarcaById(id);
      }

      default: {
 
        return mainResponse;
      }
    }
  } catch (err) {
    console.error('Erro ao buscar relacionamentos adicionais:', err);
  
    return mainResponse;
  }
};



/*
Busca por nome:

resourceData = {
  name: [valor]
}

*/
export const getCatalogSearch = async (resource, resourceData) => {
  const queryParams = new URLSearchParams({ ...resourceData }).toString();
  const response = await authFetch(`${API_URL}/catalogo/${resource}/search?${queryParams}`, {
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