import styles from './Historico.module.css';
import { useState, useEffect } from 'react';
import filtro from '@/assets/filtro.svg';
import lupa from '@/assets/lupa.svg';

const itemsPerPage = 10;

const documentos = [
  { id: 1, name: 'Documento A', version: 'v1', date: '2025-01-01' },
  { id: 2, name: 'Documento B', version: 'v2', date: '2025-01-05' },
  { id: 3, name: 'Documento C', version: 'v1', date: '2025-01-10' },
  { id: 4, name: 'Documento D', version: 'v3', date: '2025-01-15' },
  { id: 5, name: 'Documento E', version: 'v1', date: '2025-01-20' },
  { id: 6, name: 'Documento F', version: 'v2', date: '2025-01-25' },
  { id: 7, name: 'Documento G', version: 'v1', date: '2025-01-30' },
  { id: 8, name: 'Documento H', version: 'v4', date: '2025-02-01' },
  { id: 9, name: 'Documento I', version: 'v1', date: '2025-02-05' },
  { id: 10, name: 'Documento J', version: 'v1', date: '2025-02-10' },
];

const Historico = () => {
  const [docs, setDocs] = useState([]);
  const [docsPaginados, setDocsPaginados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    try {
      setDocs(documentos);
      setTotalPages(Math.ceil(documentos.length / itemsPerPage));
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = docs.slice(startIndex, endIndex);
    setDocsPaginados(paginatedData);
  }, [currentPage, docs]);

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

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Histórico de alteração</h1>
        </div>
        <div className={styles.actionBar}>
          <div className={styles.actionsButtons}>
            <button className={styles.filterButton}>
              <img src={filtro} alt="Filtros" />
              Filtros
            </button>
            <div className={styles.searchContainer}>
              <img src={lupa} alt="Buscar" className={styles.searchIcon} />
              <input className={styles.searchInput} placeholder="Buscar" />
            </div>
          </div>
          <div className={styles.actionText}>
            <p>
              Todos os documentos{'  '}
              <span className={styles.value}>({docs.length}) </span>
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.centeredMessage}>
          <p>Carregando...</p>
        </div>
      ) : error ? (
        <div className={styles.centeredMessage}>
          <p className={styles.error}>Erro: {error}</p>
        </div>
      ) : (
        <table className={styles.docsTable}>
          <thead>
            <tr>
              <th>Documento</th>
              <th>Versão</th>
              <th>Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {docsPaginados.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.version}</td>
                <td>{doc.date}</td>
                <td>
                  <button className={styles.menuButton}>
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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

export default Historico;
