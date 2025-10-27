import styles from './Table.module.css';
import SelectItemModal from '../forms/SelectItemModal/SelectItemModal';
import { useState } from 'react';

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
    setIsModalOpen(true);
    setTitle(title);
    setActiveRowIndex(rowIndex);

  };

const handleSelectedItems = (items, column) => {
  if (activeRowIndex === null) return;

  const updatedData = [...data];

  updatedData.splice(activeRowIndex, 1, ...items.map((item) => {
    const newRow = columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
    newRow[column] = item.name;
    return newRow;
  }));

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
              {columns.map((column) => (
                <td key={column}>
                  <button
                    className={styles.cellButton}
                    onClick={() => handleOpenModal(column, i)}
                  >
                    <input
                      type="text"
                      value={line[column]}
                      onChange={(e) => updateCell(i, column, e.target.value)}
                    />
                  </button>
                </td>
              ))}
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
          onClose={() => setIsModalOpen(false)}
          onSave={handleSelectedItems}
        />
      )}
    </div>
  );
};

export default Table;
