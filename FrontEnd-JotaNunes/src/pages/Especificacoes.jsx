import { useState, useEffect } from 'react';
import ItemCard from '@/components/ItemCard/ItemCard';
import styles from './Especificacoes.module.css';
import { getAllAmbientes } from '@/services/specService';

const itemsPerPage = 8;

const Especificacoes = () => {
  const [ambientes, setAmbientes] = useState([]);
  const [ambientesPaginados, setAmbientesPaginados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchAmbientes = async () => {
      try {
        const data = await getAllAmbientes();
        setAmbientes(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAmbientes();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedData = ambientes.slice(startIndex, endIndex);
    setAmbientesPaginados(paginatedData);
  }, [currentPage, ambientes]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((currentPage) => currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((currentPage) => currentPage - 1);
    }
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Erro ao buscar dados: {error}</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Consulta de especificações</h1>
          <p className={styles.subtitle}>
            Gerencie os membros da sua equipe e suas permissões de conta aqui
          </p>
        </div>
        <div className={styles.buttonsArea}>
          <input placeholder="buscar" />
          <button>Padrão</button>
          <button>Ambiente</button>
          <button>Item</button>
          <button>Materia</button>
          <button>Marca</button>
        </div>
      </div>

      <div className={styles.itemsArea}>
        <ul>
          {ambientesPaginados.map((ambiente) => (
            <ItemCard key={ambiente.id} text={ambiente.name} />
          ))}
        </ul>
      </div>

      <div className={styles.paginationArea}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
          Próximo
        </button>
      </div>
    </div>
  );
};

export default Especificacoes;
