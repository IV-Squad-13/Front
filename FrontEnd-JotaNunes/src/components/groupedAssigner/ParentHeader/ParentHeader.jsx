import { useState } from "react";
import styles from "@/components/groupedAssigner/GroupedAssigner.module.css";

const ParentHeader = ({ parent, onEditParent, onDeleteParent }) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(parent.name ?? "");

    const startEdit = (e) => {
        e.stopPropagation?.();
        setEditing(true);
    };

    const finishEdit = (e) => {
        e.preventDefault?.();
        e.stopPropagation?.();

        const trimmed = value.trim();
        const original = (parent.name ?? "").trim();

        if (trimmed && trimmed !== original && typeof onEditParent === "function") {
            onEditParent(trimmed);
        }

        setEditing(false);
    };

    const cancelEdit = (e) => {
        e.stopPropagation?.();
        setValue(parent.name ?? "");
        setEditing(false);
    };

    const handleDelete = (e) => {
        e.stopPropagation?.();
        if (typeof onDeleteParent === "function") {
            onDeleteParent();
        }
    };

    return (
        <div
            className={styles.parentHeader}
            onClick={(e) => e.stopPropagation?.()}
        >
            {!editing ? (
                <>
                    <div className={styles.parentTitle}>{parent.name}</div>

                    <div className={styles.parentActions}>
                        {onEditParent && (
                            <button
                                type="button"
                                className={styles.editBtn}
                                onClick={startEdit}
                                title="Editar nome do grupo"
                            >
                                Editar
                            </button>
                        )}

                        {onDeleteParent && (
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={handleDelete}
                                title="Remover grupo"
                            >
                                Remover
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <form className={styles.editForm} onSubmit={finishEdit}>
                    <input
                        className={styles.parentInput}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onClick={(e) => e.stopPropagation?.()}
                        autoFocus
                    />
                    <div className={styles.editControls}>
                        <button type="submit" className={styles.saveBtn}>
                            Salvar
                        </button>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={cancelEdit}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ParentHeader;