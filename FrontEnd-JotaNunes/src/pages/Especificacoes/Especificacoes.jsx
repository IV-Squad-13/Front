/* eslint-disable react-hooks/exhaustive-deps */
import styles from './Especificacoes.module.css';
import { useState, useEffect } from 'react';
import Table from '@/components/table/Table';
import { createSpecification, startProcess } from '@/services/SpecificationService';
import { useAuth } from '@/context/AuthContext';

const Especificacoes = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(2); // step iniciando em 2 para evitar cadastrar um novo empreendimento para cada teste
  const [subtitle, setSubtitle] = useState('');
  const [nomeEmpreendimento, setNomeEmpreendimento] = useState('');
  const [descricaoEmpreendimento, setDescricaoEmpreendimento] = useState('');
  const [areaPrivativa, setAreaPrivativa] = useState([]);
  const [areaComum, setAreaComum] = useState([]);
  const [ambientesDetalhados, setAmbientesDetalhados] = useState({});
  const [materiaisMarcas, setMateriaisMarcas] = useState([]);
  const [title, setTitle] = useState('');
  const [empId, setEmpId] = useState(null);

  const ambientesTotais = [
    ...new Set([
      ...areaPrivativa.map((a) => a['Ambiente']),
      ...areaComum.map((a) => a['Ambiente']),
    ]),
  ].filter(Boolean);

  const totalSteps = 6 + ambientesTotais.length;

  const ambienteAtual = ambientesTotais[step - 4];

  const voltar = () => step > 0 && setStep(step - 1);
  const handleAvancar = async () => {
    if (step === 0) {
      if (!user || !user.id) {
        console.error('Usuário não autenticado.');
        return;
      }

      try {
        const payload = { name: title, creatorId: user.id };
        const response = await startProcess(payload);

        if (response && response.id) {
          setEmpId(response.id);
          setStep(step + 1);
        }
      } catch (error) {
        console.error('Erro ao iniciar o processo:', error);
      }
    } else if (step === 1) {
      if (!empId) {
        console.error('id do empreendimento nao foi definido');
        return;
      }

      try {
        const payload = { name: nomeEmpreendimento, desc: descricaoEmpreendimento, empId: empId };
        const response = await createSpecification(payload);

        if (response && response.id) {
          setStep(step + 1);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const initAmbiente = (nome) => {
    if (!ambientesDetalhados[nome]) {
      const todasAsLinhas = [...areaPrivativa, ...areaComum];

      const linhasDoAmbiente = todasAsLinhas.filter(
        (linha) => linha['Ambiente'] === nome && linha['Item']?.trim() !== '',
      );

      const itensSeparados = linhasDoAmbiente.flatMap((linha) =>
        linha['Item']
          .split(';')
          .map((item) => item.trim())
          .filter(Boolean),
      );

      const novaTabela = itensSeparados.map((item) => ({
        Item: item,
        Descrição: '',
      }));

      setAmbientesDetalhados((prev) => ({
        ...prev,
        [nome]: novaTabela,
      }));
    }
  };

  useEffect(() => {
    if (step === 0) setSubtitle('Bem vindo ao cadastro de especificações');
    else if (step === 1)
      setSubtitle('Insira aqui os dados do novo empreendimento');
    else if (step === 2)
      setSubtitle(`${nomeEmpreendimento} - Unidades privativas`);
    else if (step === 3) setSubtitle(`${nomeEmpreendimento} - Área comum`);
    else if (step === totalSteps - 1)
      setSubtitle(`${nomeEmpreendimento} - Marcas e materiais`);
    else if (step === totalSteps) setSubtitle(`${nomeEmpreendimento} - Resumo`);
    else setSubtitle(`${nomeEmpreendimento} - ${ambienteAtual}`);
  }, [step, nomeEmpreendimento, ambienteAtual, totalSteps]);

  useEffect(() => {
    if (ambienteAtual && !ambientesDetalhados[ambienteAtual]) {
      initAmbiente(ambienteAtual);
    }
  }, [ambienteAtual]);

  const renderStep = () => {
    if (step === 0) {
      return (
        <>
          <div className={styles.inputArea}>
            <label htmlFor="title">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <div className={styles.inputArea}>
            <label htmlFor="name">Nome do empreendimento</label>
            <input
              type="text"
              value={nomeEmpreendimento}
              onChange={(e) => setNomeEmpreendimento(e.target.value)}
            />
          </div>
          <div className={styles.inputArea}>
            <label htmlFor="description">Descrição do empreendimento</label>
            <textarea
              className={styles.descriptionInput}
              value={descricaoEmpreendimento}
              onChange={(e) => setDescricaoEmpreendimento(e.target.value)}
            />
          </div>
        </>
      );
    }

    if (step === 2) {
      return (
        <Table
          columns={['Ambiente', 'Item']}
          data={areaPrivativa}
          setData={setAreaPrivativa}
        />
      );
    }

    if (step === 3) {
      return (
        <Table
          columns={['Ambiente', 'Item']}
          data={areaComum}
          setData={setAreaComum}
        />
      );
    }

    if (ambienteAtual) {
      return (
        <Table
          columns={['Item', 'Descrição']}
          data={ambientesDetalhados[ambienteAtual] || []}
          setData={(novaTabela) =>
            setAmbientesDetalhados((prev) => ({
              ...prev,
              [ambienteAtual]: novaTabela,
            }))
          }
        />
      );
    }

    if (step === totalSteps - 1) {
      return (
        <Table
          columns={['Material', 'Marca']}
          data={materiaisMarcas}
          setData={setMateriaisMarcas}
        />
      );
    }

    if (step === totalSteps) {
      return (
        <div className={styles.resumo}>
          <h2>Resumo do Empreendimento</h2>

          <div className={styles.resumoSection}>
            <p>
              <strong>Nome:</strong> {nomeEmpreendimento}
            </p>
            <p>
              <strong>Descrição:</strong> {descricaoEmpreendimento}
            </p>
          </div>

          <div className={styles.resumoSection}>
            <h3>Área Privativa</h3>
            <ul>
              {areaPrivativa.length === 0 && <li>-</li>}
              {areaPrivativa.map((linha, i) => (
                <li key={i}>
                  {linha.Ambiente} — {linha.Item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.resumoSection}>
            <h3>Área Comum</h3>
            <ul>
              {areaComum.length === 0 && <li>-</li>}
              {areaComum.map((linha, i) => (
                <li key={i}>
                  {linha.Ambiente} — {linha.Item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.resumoSection}>
            <h3>Ambientes</h3>
            {Object.keys(ambientesDetalhados).length === 0 && <p>-</p>}
            {Object.entries(ambientesDetalhados).map(([amb, itens]) => (
              <div key={amb}>
                <strong>{amb}</strong>
                <ul>
                  {itens.map((it, i) => (
                    <li key={i}>
                      {it.Item} — {it.Descrição}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.resumoSection}>
            <h3>Materiais e Marcas</h3>
            <ul>
              {materiaisMarcas.length > 0 ? (
                materiaisMarcas.map((item, i) => (
                  <li key={i}>
                    {item.Material} — {item.Marca}
                  </li>
                ))
              ) : (
                <li>-</li>
              )}
            </ul>
          </div>
        </div>
      );
    }

    return null;
  };

  const handleFinish = () => {
    const payload = {
      nomeEmpreendimento,
      descricaoEmpreendimento,
      areaPrivativa,
      areaComum,
      ambientesDetalhados,
      materiaisMarcas,
    };

    console.log(payload);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Cadastro de Especificações</h1>
          <p className={styles.subtitle}>{subtitle}</p>
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
        {step < totalSteps ? (
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
