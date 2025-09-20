import { useState, useEffect } from 'react';
import ItemCard from '@/components/ItemCard/ItemCard';
import styles from './Catalogo.module.css';
import { getCatalogBySpec } from '@/services/CatalogService';

const itemsPerPage = 8;

const Catalogo = () => {
  const [spec, setSpec] = useState([]);
  const [specsPaginados, setSpecsPaginados] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeButton, setActiveButton] = useState('ambiente');

  const specs = ['ambiente', 'item', 'material', 'marca'];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getCatalogBySpec(activeButton);

        setSpec(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeButton]);

    useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = spec.slice(startIndex, endIndex);
    setSpecsPaginados(paginatedData);
  }, [currentPage, spec]);

  const handleSpecChange = (newSpec) => {
    setActiveButton(newSpec);
    setCurrentPage(1);
  };

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
          <h1 className={styles.title}>Catálogo</h1>
          <p className={styles.subtitle}>
            Gerencie os seus itens aqui
          </p>
        </div>
        <div className={styles.buttonsArea}>
          <input placeholder="buscar" />
          {specs.map((spec) => (
            <button
              key={spec}
              onClick={() => handleSpecChange(spec)}
              className={activeButton === spec ? styles.activeButton : ''}
            >
              {spec.charAt(0).toUpperCase() + spec.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.itemsArea}>
        {isLoading ? (
          <p>Carregando itens...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>Erro: {error}</p>
        ) : specsPaginados.length > 0 ? (
          <ul>
            {specsPaginados.map((item) => (
              <ItemCard key={item.id} text={item.name} />
            ))}
          </ul>
        ) : (
          <p>Nenhum item encontrado para "{activeButton}".</p>
        )}
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

export default Catalogo;
