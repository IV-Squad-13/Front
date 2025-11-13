import { useEffect, useState } from 'react';
import styles from './SelectItemModal.module.css';
import { getCatalogByResource } from '@/services/CatalogService';

const SelectItemModal = ({ header, resource: resourceType, onClose, onSave }) => {
  const [resource, setResource] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await getCatalogByResource(resourceType);
        setResource(data);
      } catch (err) {
        console.error('Erro ao buscar recurso: ', err);
      }
    };
    fetchResource();
  }, [resourceType]);

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i != item) : [...prev, item],
    );
  };

  const handleSave = () => {
    onSave(selectedItems, header);
    onClose();
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainForm}>
        <h2 className={styles.title}>Escolha os seus {header}</h2>
        <div className={styles.mainArea}>
          <table>
            <thead>
              <tr>
                <td></td>
                <td>{header}</td>
              </tr>
            </thead>
            <tbody>
              {resource.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item)}
                      onChange={() => toggleItem(item)}
                    />
                  </td>
                  <td>{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.buttonsArea}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectItemModal;
