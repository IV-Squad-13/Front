import { useEffect, useState } from 'react';
import styles from './SelectItemModal.module.css';
import { getCatalogByResource } from '@/services/CatalogService';

const SelectItemModal = ({ header, onClose }) => {
  const [resource, setResource] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await getCatalogByResource(header);
        setResource(data);
      } catch (err) {
        console.error('Erro ao buscar recurso: ', err);
      }
    };
    fetchResource();
  }, [header]);

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
                    <input type="checkbox" name="checkboxItem" />
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
          <button
            className={styles.saveButton}
            onClick={() => console.log('selecionando item')}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectItemModal;
