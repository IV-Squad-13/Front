import {
  getAllSpecifications,
  addDocElementBulk,
} from '@/services/SpecificationService';
import { getCatalogByResource } from '@/services/CatalogService';

/**
 * Processa ambientes e seus itens em bulk
 * @param {Array} dataArea - Array com dados da área (privativa ou comum)
 * @param {number} empId - ID do empreendimento
 * @param {string} localType - Tipo do local ('UNIDADES_PRIVATIVAS' ou 'AREA_COMUM')
 * @returns {Promise<void>}
 */
export const processAreaWithItems = async (dataArea, empId, localType) => {
  const specs = await getAllSpecifications();
  const spec = specs.find((s) => s.empreendimentoId === empId);

  if (!spec) throw new Error(`Empreendimento ID ${empId} não encontrado.`);

  const currentSpecId = spec.id;
  const localData = spec.locais?.find((l) => l.local === localType);
  const parentId = localData?.id;

  if (!currentSpecId || !parentId) {
    throw new Error('specId ou parentId não encontrados.');
  }

  const catalogAmbientes = await getCatalogByResource('ambiente');
  const catalogItens = await getCatalogByResource('item');

  // Processa ambientes
  const bulkAmbientes = [];
  for (const linha of dataArea) {
    const nomeAmbiente = linha['Ambiente']?.trim();
    if (!nomeAmbiente) continue;

    const ambienteCatalog = catalogAmbientes.find(
      (a) => a.name === nomeAmbiente,
    );

    if (!ambienteCatalog) {
      console.warn('Ambiente não encontrado: ', nomeAmbiente);
      continue;
    }

    bulkAmbientes.push({
      type: 'AMBIENTE',
      elementId: ambienteCatalog.id,
      parentId: parentId,
    });
  }

  if (bulkAmbientes.length === 0) {
    console.warn('nenhum ambiente para envio');
    return;
  }

  // Envia ambientes em bulk
  const payloadAmbientes = { elements: bulkAmbientes };
  const responseAmbientes = await addDocElementBulk(
    payloadAmbientes,
    currentSpecId,
  );
  console.log('bulk de ambientes enviado com sucesso: ', responseAmbientes);

  const ambientesIds = responseAmbientes.AMBIENTE.map((ambiente) => ambiente.id);

  // Processa itens para cada ambiente
  let iterator = 0;
  for (const linha of dataArea) {
    const id = ambientesIds[iterator];
    const itens =
      linha['Item']
        ?.split(';')
        .map((i) => i.trim())
        .filter(Boolean) || [];

    for (const itemNome of itens) {
      const bulkItens = [];
      const itemCatalog = catalogItens.find((it) => it.name === itemNome);

      if (!itemCatalog) {
        console.warn(`Item "${itemNome}" não encontrado no catálogo.`);
        continue;
      }

      bulkItens.push({
        type: 'ITEM',
        elementId: itemCatalog.id,
        parentId: id,
      });

      const payloadItens = { elements: bulkItens };
      const responseItens = await addDocElementBulk(payloadItens, currentSpecId);
      console.log('bulk de itens enviado com sucesso: ', responseItens);
    }
    iterator += 1;
  }
};

/**
 * Processa materiais e marcas em bulk
 * @param {Array} materiaisMarcas - Array com dados de materiais e marcas
 * @param {number} empId - ID do empreendimento
 * @returns {Promise<void>}
 */
export const processMateriaisAndMarcas = async (materiaisMarcas, empId) => {
  const specs = await getAllSpecifications();
  const spec = specs.find((s) => s.empreendimentoId === empId);

  if (!spec) throw new Error(`Empreendimento ID ${empId} não encontrado.`);

  const currentSpecId = spec.id;
  if (!currentSpecId) {
    throw new Error('specId não encontrados.');
  }

  const catalogMateriais = await getCatalogByResource('material');
  const catalogMarcas = await getCatalogByResource('marca');

  // Processa materiais
  const bulkMateriais = [];
  for (const linha of materiaisMarcas) {
    const nomeMaterial = linha['Material']?.trim();
    if (!nomeMaterial) continue;

    const materialCatalog = catalogMateriais.find(
      (m) => m.name === nomeMaterial,
    );

    if (!materialCatalog) {
      console.warn('Material não encontrado: ', nomeMaterial);
      continue;
    }

    bulkMateriais.push({
      type: 'MATERIAL',
      elementId: materialCatalog.id,
    });
  }

  if (bulkMateriais.length === 0) {
    console.warn('nenhum material para envio');
    return;
  }

  // Envia materiais em bulk
  const payloadMateriais = { elements: bulkMateriais };
  const responseMateriais = await addDocElementBulk(
    payloadMateriais,
    currentSpecId,
  );
  console.log('bulk de materiais enviado com sucesso: ', responseMateriais);

  const materiaisId = responseMateriais.MATERIAL.map((material) => material.id);

  // Processa marcas para cada material
  let iterator = 0;
  for (const linha of materiaisMarcas) {
    const id = materiaisId[iterator];
    const marcas =
      linha['Marca']
        ?.split(';')
        .map((i) => i.trim())
        .filter(Boolean) || [];

    for (const marcaNome of marcas) {
      const bulkMarcas = [];
      const marcaCatalog = catalogMarcas.find((m) => m.name === marcaNome);

      if (!marcaCatalog) {
        console.warn(`Marca "${marcaNome}" não encontrado no catálogo.`);
        continue;
      }

      bulkMarcas.push({
        type: 'MARCA',
        elementId: marcaCatalog.id,
        parentId: id,
      });

      const payloadMarcas = { elements: bulkMarcas };
      const responseMarcas = await addDocElementBulk(payloadMarcas, currentSpecId);
      console.log('bulk de marcas enviado com sucesso: ', responseMarcas);
    }
    iterator += 1;
  }
};

/**
 * Inicializa detalhes de um ambiente
 * @param {string} nomeAmbiente - Nome do ambiente
 * @param {Array} areaPrivativa - Dados da área privativa
 * @param {Array} areaComum - Dados da área comum
 * @returns {Promise<Array>} Array com os itens detalhados do ambiente
 */
export const initializeAmbienteDetails = async (
  nomeAmbiente,
  areaPrivativa,
  areaComum,
) => {
  const todasAsLinhas = [...areaPrivativa, ...areaComum];

  const linhasDoAmbiente = todasAsLinhas.filter(
    (linha) =>
      linha['Ambiente'] === nomeAmbiente && linha['Item']?.trim() !== '',
  );

  const itensSeparados = linhasDoAmbiente.flatMap((linha) =>
    linha['Item']
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean),
  );

  const catalogItens = await getCatalogByResource('item');

  return itensSeparados.map((item) => {
    const itemCatalog = catalogItens.find((it) => it.name === item);
    return {
      Item: item,
      Descrição: itemCatalog?.desc || '',
    };
  });
};
