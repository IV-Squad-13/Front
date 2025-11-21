import { useState } from "react";
import styles from "./CommaListEditor.module.css";

const CommaListEditor = ({ items = [], onRename, onDelete }) => {
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");

    const startEdit = (item) => {
        setEditingId(item.id_);
        setEditValue(item.nome?.[1] ?? "");
    };

    const finishEdit = () => {
        if (editingId != null) {
            const trimmed = (editValue ?? "").trim();
            if (trimmed.length > 0) {
                onRename(editingId, trimmed);
            }
        }
        setEditingId(null);
        setEditValue("");
    };

    return (
        <div className={styles.pillsRow}>
            {items.map(item => {
                const name = item.nome?.[1] ?? "";
                if (editingId === item.id_) {
                    return (
                        <div className={styles.pillEditing} key={item.id_}>
                            <input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={finishEdit}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") finishEdit();
                                }}
                                autoFocus
                                className={styles.pillInput}
                            />
                            <button className={styles.pillSave} onClick={finishEdit}>OK</button>
                        </div>
                    );
                }

                return (
                    <div className={styles.pill} key={item.id_}>
                        <span className={styles.pillLabel} onDoubleClick={() => startEdit(item)}>
                            {name}
                        </span>
                        <button
                            className={styles.pillDel}
                            title="Remover"
                            onClick={() => onDelete(item.id_)}
                        >
                            ×
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default CommaListEditor;