/**
 * Tipos de etapas disponíveis
 */
export const STEP_TYPES = {
  FORM: 'form',
  TABLE: 'table',
  AMBIENTE_DETALHADO: 'ambiente_detalhado',
  RESUMO: 'resumo',
};

/**
 * Tipos de locais para processamento
 */
export const LOCAL_TYPES = {
  UNIDADES_PRIVATIVAS: 'UNIDADES_PRIVATIVAS',
  AREA_COMUM: 'AREA_COMUM',
};

/**
 * Configuração de cada etapa do fluxo
 * @param {Object} state - Estado do componente principal
 * @returns {Array} Array de configurações das etapas
 */
export const getStepConfig = (state) => {
  const {
    title,
    setTitle,
    nomeEmpreendimento,
    setNomeEmpreendimento,
    descricaoEmpreendimento,
    setDescricaoEmpreendimento,
    areaPrivativa,
    setAreaPrivativa,
    areaComum,
    setAreaComum,
    ambientesDetalhados,
    setAmbientesDetalhados,
    materiaisMarcas,
    setMateriaisMarcas,
    ambientesTotais,
  } = state;

  // Etapa 0: Título
  const step0 = {
    type: STEP_TYPES.FORM,
    subtitle: 'Bem vindo ao cadastro de especificações',
    fields: [
      {
        name: 'title',
        label: 'Título',
        type: 'text',
        value: title,
        onChange: setTitle,
      },
    ],
  };

  // Etapa 1: Dados do empreendimento
  const step1 = {
    type: STEP_TYPES.FORM,
    subtitle: 'Insira aqui os dados do novo empreendimento',
    fields: [
      {
        name: 'name',
        label: 'Nome do empreendimento',
        type: 'text',
        value: nomeEmpreendimento,
        onChange: setNomeEmpreendimento,
      },
      {
        name: 'description',
        label: 'Descrição do empreendimento',
        type: 'textarea',
        value: descricaoEmpreendimento,
        onChange: setDescricaoEmpreendimento,
      },
    ],
  };

  // Etapa 2: Área privativa
  const step2 = {
    type: STEP_TYPES.TABLE,
    subtitle: `${nomeEmpreendimento} - Unidades privativas`,
    columns: ['Ambiente', 'Item'],
    data: areaPrivativa,
    setData: setAreaPrivativa,
    localType: LOCAL_TYPES.UNIDADES_PRIVATIVAS,
  };

  // Etapa 3: Área comum
  const step3 = {
    type: STEP_TYPES.TABLE,
    subtitle: `${nomeEmpreendimento} - Área comum`,
    columns: ['Ambiente', 'Item'],
    data: areaComum,
    setData: setAreaComum,
    localType: LOCAL_TYPES.AREA_COMUM,
  };

  // Etapas intermediárias: Ambientes detalhados
  const ambientesSteps = ambientesTotais.map((ambiente) => ({
    type: STEP_TYPES.AMBIENTE_DETALHADO,
    subtitle: `${nomeEmpreendimento} - ${ambiente}`,
    ambiente,
    columns: ['Item', 'Descrição'],
    data: ambientesDetalhados[ambiente] || [],
    setData: (novaTabela) =>
      setAmbientesDetalhados((prev) => ({
        ...prev,
        [ambiente]: novaTabela,
      })),
  }));

  // Penúltima etapa: Materiais e marcas
  const stepMateriaisMarcas = {
    type: STEP_TYPES.TABLE,
    subtitle: `${nomeEmpreendimento} - Marcas e materiais`,
    columns: ['Material', 'Marca'],
    data: materiaisMarcas,
    setData: setMateriaisMarcas,
  };

  // Última etapa: Resumo
  const stepResumo = {
    type: STEP_TYPES.RESUMO,
    subtitle: `${nomeEmpreendimento} - Resumo`,
    data: {
      nomeEmpreendimento,
      descricaoEmpreendimento,
      areaPrivativa,
      areaComum,
      ambientesDetalhados,
      materiaisMarcas,
    },
  };

  return [
    step0,
    step1,
    step2,
    step3,
    ...ambientesSteps,
    stepMateriaisMarcas,
    stepResumo,
  ];
};
