import { useState } from "react";
import styles from "@/components/groupedAssignmentTable/GroupedAssignmentTable.module.css";
import Button from "@/components/button/Button";

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
        >
            {!editing ? (
                <div className={styles.headerContent}>
                    <div className={styles.parentTitle}>{parent.name}</div>

                    <div className={styles.parentActions}>
                        {onEditParent && (
                            <Button
                                type="button"
                                variant="edit contained"
                                onClick={startEdit}
                                title="Editar nome do grupo"
                            >
                                Editar
                            </Button>
                        )}

                        {onDeleteParent && (
                            <Button
                                type="button"
                                variant="delete contained"
                                onClick={handleDelete}
                                title="Remover grupo"
                            >
                                Remover
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <form className={styles.headerContent} onSubmit={finishEdit}>
                    <input
                        className={styles.parentInput}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onClick={(e) => e.stopPropagation?.()}
                        autoFocus
                    />
                    <div className={styles.parentActions}>
                        <Button
                            type="submit"
                            variant="edit contained"
                        >
                            Salvar
                        </Button>
                        <Button
                            type="button"
                            variant="delete contained"
                            onClick={cancelEdit}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ParentHeader;