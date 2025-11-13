"use client"

import { useState, useEffect } from "react"
import styles from "./AddModal.module.css"
import Input from "@/components/input/Input"
import {postCatalogByResource, getItemTypes} from "@/services/CatalogService"

const AddModal = ({ activeSpec, onSave, onClose, changeCount}) => {
  const [itemData, setItemData] = useState({
    name: "",
    desc: "",
    type: "",
    local: ""
  })

  const [itemTypes, setItemTypes] = useState([])
  const [isLoadingTypes, setIsLoadingTypes] = useState(false)

  useEffect(() => {
    if (activeSpec === 'item') {
      const fetchTypes = async () => {
        setIsLoadingTypes(true)
        try {
          const data = await getItemTypes() 
          setItemTypes(data)
        } catch (error) {
          console.error("Erro ao buscar tipos de item:", error)
        } finally {
          setIsLoadingTypes(false)
        }
      }
      fetchTypes()
    }
  }, [activeSpec])

  const handleChange = (e) => {
    setItemData({
      ...itemData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async () => {
    // Validação básica
    if (!itemData.name.trim()) {
      alert("Por favor, preencha o nome do item")
      return
    }
    if (activeSpec === "ambiente" && !itemData.local) {
        alert("Por favor, selecione a Área")
        return
    }
    if (activeSpec === "item" && !itemData.type) {
        alert("Por favor, selecione o Tipo de item")
        return
    }

    try {
      const newItem = await postCatalogByResource(activeSpec, itemData);
      console.log("[v0] Adicionando item:", { spec: activeSpec, data: itemData })

      onSave(newItem)
      onClose()
    } catch (error) {
      console.error("Erro ao adicionar item: ", error)
      alert(`Falha ao adicionar o item. Por favor, tente novamente. Detalhes: ${error.message}`);
    }
  }

  return (
    <div className={styles.container} onClick={onClose}>
      <div className={styles.mainForm} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Adicionar {activeSpec}</h2>

        <div className={styles.inputArea}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Nome
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder={`Nome do ${activeSpec}`}
              value={itemData.name}
              onChange={handleChange}
            />
          </div>

          {(activeSpec === "ambiente") &&(
            <div className={styles.inputGroup}>
              <label htmlFor="areaLabel" className={styles.label}>
                Área
              </label>
              <select 
                id="local"
                name="local"
                className={styles.select} 
                value={itemData.local || ''} 
                onChange={handleChange}
              >
                <option value="">Selecionar...</option>
                <option value="UNIDADES_PRIVATIVAS">Unidade Privativa</option>
                <option value="AREA_COMUM">Área Comum</option>
              </select>
            </div>
          )}

          {activeSpec === "item" && (
            <div className={styles.inputGroup}>
              <label htmlFor="desc" className={styles.label}>
                Descrição
              </label>
              <textarea
                name="desc"
                id="desc"
                placeholder="Descrição do item"
                value={itemData.desc}
                onChange={handleChange}
                className={styles.textarea}
                rows={4}
              />
              {isLoadingTypes ? (
                <p>Carregando tipos de item...</p>
              ) : (
                <select
                  name="type"
                  id="type"
                  value={itemData.type}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Selecione o Tipo</option>
                  {itemTypes.map((type) => (
                    <option key={type.type} value={type.type}>
                      {type.name} 
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        <div className={styles.buttonsArea}>
          <div className={styles.actionButtons}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button className={styles.saveButton} onClick={handleSubmit}>
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddModal
