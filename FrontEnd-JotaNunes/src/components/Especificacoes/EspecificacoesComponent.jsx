/* eslint-disable react-hooks/exhaustive-deps */
import styles from './Especificacoes.module.css';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';

// Componentes
import FormStep from './components/FormStep';
import TableStep from './components/TableStep';
import ResumoStep from './components/ResumoStep';

// Configuração e helpers
import { getStepConfig, STEP_TYPES } from './config/stepConfig';
import { useStepHandlers } from './hooks/useStepHandlers';
import { initializeAmbienteDetails } from './utils/stepHelpers';

const Especificacoes = () => {
  const { user } = useAuth();

  // Estados principais
  const [step, setStep] = useState(0);
  const [empId, setEmpId] = useState(null);

  // Estados do formulário
  const [title, setTitle] = useState('');
  const [nomeEmpreendimento, setNomeEmpreendimento] = useState('');
  const [descricaoEmpreendimento, setDescricaoEmpreendimento] = useState('');

  // Estados das tabelas
  const [areaPrivativa, setAreaPrivativa] = useState([]);
  const [areaComum, setAreaComum] = useState([]);
  const [ambientesDetalhados, setAmbientesDetalhados] = useState({});
  const [materiaisMarcas, setMateriaisMarcas] = useState([]);

  // Calcula ambientes totais
  const ambientesTotais = useMemo(
    () =>
      [
        ...new Set([
          ...areaPrivativa.map((a) => a['Ambiente']),
          ...areaComum.map((a) => a['Ambiente']),
        ]),
      ].filter(Boolean),
    [areaPrivativa, areaComum],
  );

  // Configuração das etapas
  const stepConfig = useMemo(
    () =>
      getStepConfig({
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
      }),
    [
      title,
      nomeEmpreendimento,
      descricaoEmpreendimento,
      areaPrivativa,
      areaComum,
      ambientesDetalhados,
      materiaisMarcas,
      ambientesTotais,
    ],
  );

  const totalSteps = stepConfig.length;
  const currentStepConfig = stepConfig[step] || {};

  // Handlers
  const { handleAvancar, voltar, handleFinish } = useStepHandlers({
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
  });

  // Inicializa detalhes do ambiente quando necessário
  useEffect(() => {
    if (
      currentStepConfig.type === STEP_TYPES.AMBIENTE_DETALHADO &&
      currentStepConfig.ambiente &&
      !ambientesDetalhados[currentStepConfig.ambiente]
    ) {
      (async () => {
        const detalhes = await initializeAmbienteDetails(
          currentStepConfig.ambiente,
          areaPrivativa,
          areaComum,
        );
        setAmbientesDetalhados((prev) => ({
          ...prev,
          [currentStepConfig.ambiente]: detalhes,
        }));
      })();
    }
  }, [currentStepConfig, ambientesDetalhados, areaPrivativa, areaComum]);

  /**
   * Renderiza a etapa atual baseada no tipo configurado
   */
  const renderStep = () => {
    switch (currentStepConfig.type) {
      case STEP_TYPES.FORM:
        return <FormStep fields={currentStepConfig.fields} />;

      case STEP_TYPES.TABLE:
      case STEP_TYPES.AMBIENTE_DETALHADO:
        return (
          <TableStep
            columns={currentStepConfig.columns}
            data={currentStepConfig.data}
            setData={currentStepConfig.setData}
          />
        );

      case STEP_TYPES.RESUMO:
        return <ResumoStep {...currentStepConfig.data} />;

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Cadastro de Especificações</h1>
          <p className={styles.subtitle}>{currentStepConfig.subtitle}</p>
        </div>
      </div>

      <div className={styles.mainArea}>{renderStep()}</div>

      <div className={styles.buttonsArea}>
        <button
          onClick={voltar}
          disabled={step === 0}
          className={styles.button}
        >
          Voltar
        </button>
        {step < totalSteps - 1 ? (
          <button onClick={handleAvancar} className={styles.button}>
            Avançar
          </button>
        ) : (
          <button className={styles.button} onClick={handleFinish}>
            Finalizar
          </button>
        )}
      </div>
    </div>
  );
};

export default Especificacoes;