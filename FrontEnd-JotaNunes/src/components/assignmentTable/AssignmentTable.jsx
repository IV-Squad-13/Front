import styles from "./AssignmentTable.module.css";

const formatHeader = (key) =>
    key.charAt(0).toUpperCase() + key.slice(1);

const AssignmentTable = ({ columns, data }) => {
    const autoColumns = columns || (data?.length > 0
        ? Object.keys(data[0])
        : []);

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {autoColumns.map((col) => (
                            <th key={col}>{formatHeader(col)}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, i) => (
                        <tr key={i}>
                            {autoColumns.map((col) => (
                                <td key={col}>
                                    {row[col] ?? ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentTable;