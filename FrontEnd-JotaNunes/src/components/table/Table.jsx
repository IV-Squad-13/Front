import styles from './Table.module.css';
import SelectItemModal from '../forms/SelectItemModal/SelectItemModal';
import { useState } from 'react';

// Mapeamento de colunas que possuem recursos de catálogo na API
const CATALOG_RESOURCE_MAP = {
  'Ambiente': 'ambiente',
  'Item': 'item',
  'Material': 'material',
  'Marca': 'marca',
  'Padrão': 'padrao',
};

const Table = ({ columns, data, setData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [activeRowIndex, setActiveRowIndex] = useState(null);

  const addLine = () => {
    const newLine = columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
    setData([...data, newLine]);
  };

  const updateCell = (index, column, value) => {
    const newData = [...data];
    newData[index][column] = value;
    setData(newData);
  };

  const handleOpenModal = (title, rowIndex) => {
    // Só abre o modal se a coluna tiver um recurso válido na API
    if (!CATALOG_RESOURCE_MAP[title]) {
      return;
    }

    setIsModalOpen(true);
    setTitle(title);
    setActiveRowIndex(rowIndex);
  };

const handleSelectedItems = (items, column) => {
  const updatedData = [...data];

  const isFirstColumn = columns.indexOf(column) === 0;

  if (isFirstColumn) {
    const newRows = items.map((item) => {
      const newRow = columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
      newRow[column] = item.name;
      return newRow;
    });

    updatedData.splice(activeRowIndex, 1, ...newRows);
  } else {
    const joinedItems = items.map((item) => item.name).join('; ');
    updatedData[activeRowIndex][column] = joinedItems;
  }

  setData(updatedData);
};


  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((line, i) => (
            <tr key={i}>
              {columns.map((column) => {
                const hasResource = !!CATALOG_RESOURCE_MAP[column];
                return (
                  <td key={column}>
                    <button
                      className={styles.cellButton}
                      onClick={() => handleOpenModal(column, i)}
                      style={{ cursor: hasResource ? 'pointer' : 'default' }}
                    >
                      <input
                        type="text"
                        value={line[column]}
                        onChange={(e) => updateCell(i, column, e.target.value)}
                      />
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.addMore} onClick={addLine}>
        Adicionar mais
      </button>
      {isModalOpen && (
        <SelectItemModal
          header={title}
          resource={CATALOG_RESOURCE_MAP[title]}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSelectedItems}
        />
      )}
    </div>
  );
};

export default Table;
