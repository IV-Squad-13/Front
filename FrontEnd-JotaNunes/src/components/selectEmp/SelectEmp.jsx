import Button from "../button/Button";
import styles from "./SelectEmp.module.css";

const SelectEmp = ({ onSelect, onDelete, id, name, author, dtCreated, rev }) => {
    const formattedDate = new Date(dtCreated).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className={styles.card}>
            <button
                className={styles.deleteBtn}
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                }}
            >
                ✕
            </button>

            <div className={styles.info}>
                <span>
                    <h1 className={styles.title}>{name}</h1>
                    {rev && (<p>Revisão Pendente</p>)}
                </span>

                <div className={styles.meta}>
                    <p className={styles.author}>{author}</p>
                    <p className={styles.date}>{formattedDate}</p>
                </div>
            </div>

            <div className={styles.actions}>
                <Button
                    type="button"
                    onClick={() => onSelect(id, "empreendimento")}
                    variant="outline contained"
                >
                    Editor
                </Button>

                <Button
                    type="button"
                    onClick={() => onSelect(id, "resumo")}
                    variant="outline contained"
                >
                    Resumo
                </Button>
            </div>
        </div>
    );
};

export default SelectEmp;