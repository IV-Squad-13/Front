import React, { useState } from "react";
import CommaListEditor from "./commaListEditor/CommaListEditor";
import styles from "./CellEditor.module.css"

const CellEditor = ({ row, column, onEdit }) => {
    const type = column.type || "text";

    if (type === "tuple") {
        const tuple = column.key === 'material'
            ? row[column.key]['nome']
            : row[column.key] || ["", ""];
            
        const fieldKey = tuple[0];
        const initial = tuple[1] ?? "";

        const [value, setValue] = useState(initial);

        return (
            <input
                className={styles.cellInput}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => onEdit(value, { fieldKey })}
                onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            />
        );
    }

    if (type === "text") {
        const initial = row[column.key] ?? "";
        const [value, setValue] = useState(initial);

        return (
            <input
                className={styles.cellInput}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => onEdit(value)}
                onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            />
        );
    }

    if (type === "commaList") {
        const collection = row[column.key];
        const items = (collection && Array.isArray(collection.data)) ? collection.data : [];

        return (
            <CommaListEditor
                items={items}
                onRename={(id, newName) => onEdit({ action: "rename", id, name: newName })}
                onDelete={(id) => onEdit({ action: "delete", id })}
            />
        );
    }

    return <div />;
}


export default CellEditor;