import { useCallback } from 'react';
import {
  startProcess,
  updateSpecification,
  getAllSpecifications,
} from '@/services/SpecificationService';
import {
  processAreaWithItems,
  processMateriaisAndMarcas,
} from '../utils/stepHelpers';
import { LOCAL_TYPES } from '../config/stepConfig';

/**
 * Hook customizado para gerenciar handlers das etapas
 * @param {Object} params - Parâmetros do hook
 * @returns {Object} Handlers para navegação e submissão
 */
export const useStepHandlers = ({
  step,
  setStep,
  totalSteps,
  user,
  title,
  empId,
  setEmpId,
  nomeEmpreendimento,
  descricaoEmpreendimento,
  areaPrivativa,
  areaComum,
  materiaisMarcas,
  stepConfig,
}) => {
  /**
   * Map de handlers por tipo de etapa
   */
  const stepHandlers = {
    // Etapa 0: Iniciar processo
    0: useCallback(async () => {
      if (!user || !user.id) {
        console.error('Usuário não autenticado.');
        return false;
      }

      try {
        const payload = { name: title, creatorId: user.id };
        const response = await startProcess(payload);

        if (response && response.id) {
          setEmpId(response.id);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Erro ao iniciar o processo:', error);
        return false;
      }
    }, [user, title, setEmpId]),

    // Etapa 1: Atualizar especificação
    1: useCallback(async () => {
      if (!empId) {
        console.error('id do empreendimento não foi definido');
        return false;
      }

      try {
        const specs = await getAllSpecifications();
        const spec = specs.find((s) => s.empreendimentoId == empId);

        if (!spec) {
          console.error('não foi encontrado nenhum empreendimento com esse id');
          return false;
        }

        const payload = {
          name: nomeEmpreendimento,
          desc: descricaoEmpreendimento,
          empId: empId,
        };
        const response = await updateSpecification(payload, spec.id);

        return response && response.id;
      } catch (error) {
        console.error(error);
        return false;
      }
    }, [empId, nomeEmpreendimento, descricaoEmpreendimento]),

    // Etapa 2: Processar área privativa
    2: useCallback(async () => {
      try {
        await processAreaWithItems(
          areaPrivativa,
          empId,
          LOCAL_TYPES.UNIDADES_PRIVATIVAS,
        );
        return true;
      } catch (err) {
        console.error('Erro ao cadastrar área privativa', err);
        return false;
      }
    }, [areaPrivativa, empId]),

    // Etapa 3: Processar área comum
    3: useCallback(async () => {
      try {
        await processAreaWithItems(areaComum, empId, LOCAL_TYPES.AREA_COMUM);
        return true;
      } catch (err) {
        console.error('Erro ao cadastrar área comum', err);
        return false;
      }
    }, [areaComum, empId]),
  };

  /**
   * Handler para a penúltima etapa (materiais e marcas)
   */
  const handleMateriaisMarcas = useCallback(async () => {
    try {
      await processMateriaisAndMarcas(materiaisMarcas, empId);
      return true;
    } catch (err) {
      console.error('Erro ao cadastrar materiais e marcas', err);
      return false;
    }
  }, [materiaisMarcas, empId]);

  /**
   * Função principal para avançar nas etapas
   */
  const handleAvancar = useCallback(async () => {
    // Handler específico para a etapa atual
    const handler = stepHandlers[step];

    if (handler) {
      const success = await handler();
      if (success) {
        setStep(step + 1);
      }
      return;
    }

    // Handler para penúltima etapa (materiais e marcas)
    if (step === totalSteps - 2) {
      const success = await handleMateriaisMarcas();
      if (success) {
        setStep(step + 1);
      }
      return;
    }

    // Para etapas intermediárias (ambientes detalhados), apenas avança
    if (step > 3 && step < totalSteps - 2) {
      setStep(step + 1);
      return;
    }

    // Para a última etapa (resumo), não faz nada
    if (step < totalSteps) {
      setStep(step + 1);
    }
  }, [step, stepHandlers, handleMateriaisMarcas, totalSteps, setStep]);

  /**
   * Função para voltar nas etapas
   */
  const voltar = useCallback(() => {
    if (step > 0) {
      setStep(step - 1);
    }
  }, [step, setStep]);

  /**
   * Função para finalizar o processo
   */
  const handleFinish = useCallback(() => {
    const payload = {
      nomeEmpreendimento,
      descricaoEmpreendimento,
      areaPrivativa,
      areaComum,
      ambientesDetalhados: stepConfig
        .filter((s) => s.type === 'ambiente_detalhado')
        .reduce((acc, s) => {
          acc[s.ambiente] = s.data;
          return acc;
        }, {}),
      materiaisMarcas,
    };

    console.log(payload);
  }, [
    nomeEmpreendimento,
    descricaoEmpreendimento,
    areaPrivativa,
    areaComum,
    materiaisMarcas,
    stepConfig,
  ]);

  return {
    handleAvancar,
    voltar,
    handleFinish,
  };
};
