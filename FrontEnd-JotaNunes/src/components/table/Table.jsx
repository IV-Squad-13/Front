import styles from './Table.module.css';

const Table = ({ columns, data, setData }) => {
  const addLine = () => {
    const newLine = columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
    setData([...data, newLine]);
  };

  const updateCell = (index, column, value) => {
    const newData = [...data];
    newData[index][column] = value;
    setData(newData);
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
          {data.map((linha, i) => (
            <tr key={i}>
              {columns.map((column) => (
                <td key={column}>
                  <input
                    type="text"
                    value={linha[column]}
                    onChange={(e) => updateCell(i, column, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button className={styles.addMore} onClick={addLine}>
        Adicionar mais
      </button>
    </div>
  );
};

export default Table;
