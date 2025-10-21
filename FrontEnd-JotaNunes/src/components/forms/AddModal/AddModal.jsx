"use client"

import { useState } from "react"
import styles from "./AddModal.module.css"
import Input from "@/components/input/Input"

const AddModal = ({ activeSpec, onSave, onClose }) => {
  const [itemData, setItemData] = useState({
    name: "",
    desc: "",
  })

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

    try {
      // Aqui você chamará o serviço para adicionar o item
      // const newItem = await addCatalogItem(activeSpec, itemData);
      console.log("[v0] Adicionando item:", { spec: activeSpec, data: itemData })

      onSave(itemData)
      onClose()
    } catch (error) {
      console.error("Erro ao adicionar item: ", error)
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
