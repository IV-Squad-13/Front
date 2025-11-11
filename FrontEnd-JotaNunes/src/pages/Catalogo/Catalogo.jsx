"use client"

import { useState, useEffect, useRef, useLayoutEffect } from "react"
import ItemCard from "@/components/ItemCard/ItemCard"
import styles from "./Catalogo.module.css"
import { getCatalogByResource } from "@/services/CatalogService"
import AddModal from "@/components/forms/AddModal/AddModal"

const Catalogo = () => {
  const [spec, setSpec] = useState([])
  const [specsPaginados, setSpecsPaginados] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [activeButton, setActiveButton] = useState("ambiente")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [itemsPerPage, setItemsPerPage] = useState(1)
  const containerRef = useRef(null)
  const itemRef = useRef(null)

  const specs = ["padrao", "ambiente", "item", "material", "marca"]

  const [refreshKey, setRefreshKey] = useState(0) 

  // Function to increment the state, forcing a re-render and refetch
  const forceRefresh = () => { 
    setRefreshKey(prevKey => prevKey + 1)
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await getCatalogByResource(activeButton)
        setSpec(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activeButton, refreshKey])

  useLayoutEffect(() => {
    const calculateItems = () => {
      if (containerRef.current && itemRef.current) {
        const containerHeight = containerRef.current.clientHeight
        const itemHeight = itemRef.current.offsetHeight
        const count = Math.max(1, Math.floor(containerHeight / itemHeight))
        setItemsPerPage(count)
      }
    }

    if (spec.length > 0) {
      calculateItems()
    }

    const resizeObserver = new ResizeObserver(calculateItems)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    return () => resizeObserver.disconnect()
  }, [spec])

  useEffect(() => {
    const paginatedData = spec.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    setSpecsPaginados(paginatedData)
    setTotalPages(Math.ceil(spec.length / itemsPerPage))
  }, [currentPage, spec, itemsPerPage])

  const handleSpecChange = (newSpec) => {
    setActiveButton(newSpec)
    setCurrentPage(1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((currentPage) => currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((currentPage) => currentPage - 1)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSaveItem = (newItem) => {
    console.log("[v0] Novo item salvo:", newItem)
    forceRefresh()
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Catálogo</h1>
          <p className={styles.subtitle}>Gerencie os seus itens aqui</p>
        </div>
        <div className={styles.buttonsArea}>
          <input placeholder="buscar" />
          <button className={styles.addButton} onClick={handleOpenModal}>
            Adicionar
          </button>
          {specs.map((spec) => (
            <button
              key={spec}
              onClick={() => handleSpecChange(spec)}
              className={activeButton === spec ? styles.activeButton : ""}
            >
              {spec.charAt(0).toUpperCase() + spec.slice(1)}
            </button>
          ))}
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
                <ItemCard text={item.name} />
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
      {isModalOpen && <AddModal activeSpec={activeButton} onSave={handleSaveItem} onClose={handleCloseModal}/>}
    </div>
  )
}

export default Catalogo
