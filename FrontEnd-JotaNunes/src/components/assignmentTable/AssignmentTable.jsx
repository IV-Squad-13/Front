import { deleteDocElement, updateDocElement } from "@/services/SpecificationService";
import styles from "./AssignmentTable.module.css";
import { useState, useEffect } from "react";
import { updateElementInDoc } from "@/lib/deepUpdateHelper";
import Button from "../button/Button";

const formatHeader = (key) =>
    key.charAt(0).toUpperCase() + key.slice(1);

const filterVisibleColumns = (cols) =>
    cols.filter((c) => !c.endsWith("_"));

const AssignmentTable = ({ setEmp, columns, data }) => {
    const [tableData, setTableData] = useState(data);

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const update = async (row, fieldKey, newValue) => {
        try {
            const updatedDocElement = await updateDocElement(row.id_, {
                [fieldKey]: newValue,
                docType: row.docType_.toUpperCase()
            });

            setEmp(prev => ({
                ...prev,
                doc: updateElementInDoc(prev.doc, row, updatedDocElement)
            }));

        } catch (err) {
            console.error("Failed to update:", err);
        }
    };

    const handleLocalEdit = (row, col, newValue) => {
        setTableData(prev =>
            prev.map(r =>
                r.id_ === row.id_
                    ? { ...r, [col]: [row[col][0], newValue] }
                    : r
            )
        );
    };

    const rawColumns = columns || (tableData.length > 0 ? Object.keys(tableData[0]) : []);
    const visibleCols = filterVisibleColumns(rawColumns);

    const handleDeleteRow = async (row) => {
        try {
            await deleteDocElement(row.id_, row.docType_.toUpperCase());

            setEmp(prev => ({
                ...prev,
                doc: updateElementInDoc(prev.doc, row, null, true)
            }));
        } catch (err) {
            console.error("Failed to update:", err);
        }
    }

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {visibleCols.map((col) => (
                            <th key={col}>{formatHeader(col)}</th>
                        ))}
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {tableData.map((row) => (
                        <tr key={row.id_}>
                            {visibleCols.map((col) => {
                                const cell = row[col];
                                const fieldKey = cell?.[0];
                                const fieldValue = cell?.[1] ?? "";

                                return (
                                    <td key={col}>
                                        <input
                                            className={styles.cellInput}
                                            value={fieldValue}
                                            onChange={(e) =>
                                                handleLocalEdit(row, col, e.target.value)
                                            }
                                            onBlur={(e) =>
                                                update(row, fieldKey, e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") e.target.blur();
                                            }}
                                        />
                                    </td>
                                );
                            })}

                            <td className={styles.actionsCell}>
                                <span className={styles.actionColumn}>
                                    {
                                    <Button
                                        type="button"
                                        onClick={() => handleDeleteRow(row)}
                                        variant="header"
                                    >
                                        Deletar
                                    </Button>
                                    }
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentTable;