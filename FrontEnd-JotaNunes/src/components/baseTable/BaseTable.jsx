import React from "react";
import CellEditor from "../cellEditor/CellEditor";
import styles from "./BaseTable.module.css";
import Button from "../button/Button";

const BaseTable = ({
    columns = [],
    data = [],
    onEdit = () => { },
    onDelete = () => { },
    selectRow = () => { }
}) => {

    const visibleColumns = columns.filter(col => !col.key.endsWith("_"));

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {visibleColumns.map(col => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map(row => (
                        <tr key={row.id_ || row.material?.id_ || JSON.stringify(row)}>
                            {visibleColumns.map(col => (
                                <td key={col.key}>
                                    <CellEditor
                                        row={row}
                                        column={col}
                                        onEdit={(newValue, extra) =>
                                            onEdit(row, col.key, newValue, extra)
                                        }
                                    />
                                </td>
                            ))}

                            <td className={styles.actionsCell}>
                                <div className={styles.actionColumn}>
                                    {selectRow !== undefined && (
                                        <Button
                                            type="button"
                                            variant="outline small"
                                            onClick={() => selectRow(row)}
                                            title="Selecionar"
                                        >
                                            Selecionar
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        variant="outline small"
                                        onClick={() => onDelete(row)}
                                        title="Deletar"
                                    >
                                        Deletar
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BaseTable;