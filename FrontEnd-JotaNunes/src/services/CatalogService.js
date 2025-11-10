import { API_URL } from '../main.jsx';
import { authFetch } from './AuthService';

/**
 * Helper utilitário que retorna a primeira propriedade existente em `obj`
 * a partir de uma lista de nomes alternativos. Se nenhuma existir, retorna um fallback.
 */
const firstExisting = (obj, alternatives = [], fallback = []) => {
  for (const name of alternatives) {
    if (!obj) continue;
    if (Object.prototype.hasOwnProperty.call(obj, name) && obj[name] != null) {
      return obj[name];
    }
  }
  return fallback;
};

/**
 * Normaliza uma possível coleção (Set/Array/undefined) para array.
 */
const toArray = (maybe) => {
  if (!maybe) return [];
  if (Array.isArray(maybe)) return maybe;
  // Se for um Set
  if (maybe instanceof Set) return Array.from(maybe);
  // Se for objeto com valores como {0:..., 1:...} — tenta converter
  if (typeof maybe === 'object') {
    try {
      return Array.from(Object.values(maybe));
    } catch {
      return [];
    }
  }
  return [];
};

// ====================== Serviço geral ======================

// Buscar lista de recursos (padrões, ambientes, etc)
export const getCatalogByResource = async (resource = 'padrao') => {
  const response = await authFetch(`${API_URL}/catalogo/${resource}`, {
    method: 'GET',
  });

  if (!response) {
    throw new Error(`Falha ao buscar dados de: ${resource}`);
  }

  return response;
};

// ====================== Funções específicas ======================

export const getAmbienteById = async (id) => {
  const response = await authFetch(`${API_URL}/catalogo/ambiente/${id}`, {
    method: 'GET',
  });

  if (!response || response.error) {
    throw new Error(response?.error || `Falha ao buscar o ambiente ID ${id}`);
  }

  return {
    ...response,
    locais: response.local ? [response.local] : [],
    padroes: toArray(firstExisting(response, ['padraoSet', 'padrao_list', 'padraoList', 'padroes', 'padrao'])) ,
    itens: toArray(firstExisting(response, ['itemSet', 'item_list', 'itemList', 'itens', 'item'])) ,
  };
};

export const getMaterialById = async (id) => {
  const response = await authFetch(`${API_URL}/catalogo/material/${id}`, {
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
  const response = await authFetch(`${API_URL}/catalogo/item/${id}`, {
    method: 'GET',
  });

  if (!response || response.error) {
    throw new Error(response?.error || `Falha ao buscar o item ID ${id}`);
  }

  // Algumas APIs usam 'description' / 'descricao' / 'desc'
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
  const response = await authFetch(`${API_URL}/catalogo/marca/${id}`, {
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

// ====================== Função central usada pelo componente ======================

/**
 * Busca o item principal pelo tipo e id.
 * Para tipos com relações complexas, faz chamadas adicionais e normaliza os campos.
 *
 * type: 'padrao' | 'ambiente' | 'material' | 'item' | 'marca' | outros
 */
export const getCatalogItemById = async (type, id) => {
  // fallback: tentar buscar diretamente
  const mainResponse = await authFetch(`${API_URL}/catalogo/${type}/${id}`, {
    method: 'GET',
  });

  if (!mainResponse || mainResponse.error) {
    throw new Error(mainResponse?.error || `Falha ao buscar detalhes do item: ${type}/${id}`);
  }

  try {
    switch (type) {
      case 'padrao': {
        // busca relacionamentos já existentes via endpoints especializados
        const [ambientesRes, materiaisRes] = await Promise.all([
          authFetch(`${API_URL}/catalogo/padrao/${id}/ambiente`, { method: 'GET' }),
          authFetch(`${API_URL}/catalogo/padrao/${id}/material`, { method: 'GET' }),
        ]);

        const ambientes = toArray(ambientesRes);
        const materiais = toArray(materiaisRes);

        // normaliza nomes que seu componente espera
        return {
          ...mainResponse,
          ambientes: ambientes || [],
          itens: ambientes.flatMap(a => toArray(firstExisting(a, ['itemList', 'item_set', 'itemSet', 'itens', 'items']))),
          materiais: materiais || [],
          marcas: materiais.flatMap(m => toArray(firstExisting(m, ['marcaList', 'marca_set', 'marcaSet', 'marcas']))),
        };
      }

      case 'ambiente': {
        // reutiliza getAmbienteById que já faz a normalização
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
        // Para qualquer outro tipo, retorna o objeto principal sem alterações
        return mainResponse;
      }
    }
  } catch (err) {
    console.error('Erro ao buscar relacionamentos adicionais:', err);
    // se algo falhar nas chamadas extras, devolve pelo menos a resposta principal
    return mainResponse;
  }
};
