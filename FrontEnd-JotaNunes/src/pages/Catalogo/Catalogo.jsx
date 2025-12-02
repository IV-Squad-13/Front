"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react"
import ItemCard from "@/components/ItemCard/ItemCard"
import styles from "./Catalogo.module.css"
import { deactivateResource, getCatalogByResource, getCatalogSearch, updateResource } from "@/services/CatalogService"
import AddModal from "@/components/forms/AddModal/AddModal"
import SearchBar from "@/components/searchBar/SearchBar"
import CatalogItemDetails from "@/components/CatalogItemDetails/CatalogItemDetails";
import SelectInput from "@/components/selectInput/SelectInput";

const ActiveEnum = {
  Todos: null,
  Ativo: true,
  Inativo: false
}

const Catalogo = () => {
  const [spec, setSpec] = useState([]);
  const [specsPaginados, setSpecsPaginados] = useState([]);

  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedName, setSelectedName] = useState('');
  const [activeButton, setActiveButton] = useState("padrao")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [itemsPerPage, setItemsPerPage] = useState(1);
  const containerRef = useRef(null);
  const itemRef = useRef(null);

  const [query, setQuery] = useState({ isActive: ActiveEnum.Ativo });

  const specs = ["padrao", "ambiente", "item", "material", "marca"]

  const [refreshKey, setRefreshKey] = useState(0)

  const forceRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1)
  }

  useEffect(() => {
    handleSearch();
  }, [activeButton, query.isActive]);

  useLayoutEffect(() => {
    const calculateItems = () => {
      if (containerRef.current && itemRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const itemHeight = itemRef.current.offsetHeight;
        const count = Math.max(1, Math.floor(containerHeight / itemHeight));
        setItemsPerPage(count);
      }
    };

    if (spec.length > 0) {
      calculateItems();
    }

    const resizeObserver = new ResizeObserver(calculateItems);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [spec]);

  useEffect(() => {
    const paginatedData = spec.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setSpecsPaginados(paginatedData);
    setTotalPages(Math.ceil(spec.length / itemsPerPage));
  }, [currentPage, spec, itemsPerPage]);

  const handleSpecChange = (newSpec) => {
    setActiveButton(newSpec);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenDetails = (item) => {
    setSelectedResourceId(item.id);
    setIsDetailsOpen(true);
    forceRefresh()
  };

  const handleUpdateResource = async (data) => {
    try {
      const updated = await updateResource(activeButton, data)
      const updatedSpecs = spec
        .map(spec => {
          if (spec.id === updated.id)
            return updated
          return spec
        })
      setSpec(updatedSpecs)
    } catch (err) {
      console.warn(err);
    }
  }

  const handleDeleteResource = async (resource) => {
    try {
      await deactivateResource(activeButton, resource.id);
      handleSearch();
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSearch = async (name) => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);

    let newQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v != null)
    );

    if (name) {
      newQuery.name = name;
      setQuery(newQuery);
    }

    try {
      const data = await getCatalogSearch(activeButton, newQuery);
      setSpec(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      setError(err.message);
      setSpec([]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Catálogo</h1>
          <p className={styles.subtitle}>Gerencie os seus itens aqui</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.queryFields}>
            <SearchBar
              onSearch={(query) => handleSearch(query)}
              displayButton={false}
            />
            <SelectInput
              id="isActiveFilter"
              value={query.isActive}
              onChange={(e) => setQuery({ ...query, isActive: ActiveEnum[e.target.value] })}
              options={Object.keys(ActiveEnum)}
              variant="contained"
            />
          </div>
          <div className={styles.buttonsArea}>
            <button className={styles.addButton} onClick={handleOpenModal}>
              Adicionar
            </button>
            {specs.map((specType) => (
              <button
                key={specType}
                onClick={() => handleSpecChange(specType)}
                className={activeButton === specType ? styles.activeButton : ""}
              >
                {specType.charAt(0).toUpperCase() + specType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.itemsArea} ref={containerRef}>
        {isLoading ? (
          <p>Carregando itens...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Erro: {error}</p>
        ) : specsPaginados.length > 0 ? (
          <ul>
            {specsPaginados.map((item, index) => (
              <li key={item.id} ref={index === 0 ? itemRef : null}>
                <ItemCard
                  text={item.name}
                  onClick={() => handleOpenDetails(item)}

                  onAction={() => {
                    item.isActive
                      ? handleDeleteResource(item)
                      : handleUpdateResource({ id: item.id, isActive: true });
                  }}
                  action={item.isActive ? "Deletar" : "Reativar"}

                  onEdit={(newName) =>
                    handleUpdateResource({ id: item.id, name: newName })
                  }
                />
              </li>
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

      {isModalOpen && (
        <AddModal
          activeSpec={activeButton}
          onClose={handleCloseModal}
        />
      )}

      {isDetailsOpen && selectedResourceId && (
        <CatalogItemDetails
          type={activeButton}
          id={selectedResourceId}
          setSelectedResource={setSelectedResourceId}
          setSelectedResourceType={setActiveButton}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
};

export default Catalogo;