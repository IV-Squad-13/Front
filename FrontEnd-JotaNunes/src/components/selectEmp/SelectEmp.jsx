import { useNavigate } from "react-router-dom";
import Button from "../button/Button";
import styles from "./SelectEmp.module.css";

const SelectEmp = ({ onSelect, id, name, author, dtCreated }) => {
    return (
        <div className={styles.item}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>{name}</h1>
                <span>
                    <p>{author}</p>
                    <p>{dtCreated}</p>
                </span>
            </div>
            <div className={styles.btnContainer}>
                <Button
                    type="button"
                    onClick={() => onSelect(id, "empreendimento")}
                    variant="ghost contained"
                >
                    Editor
                </Button>
                <Button
                    type="button"
                    onClick={() => onSelect(id, "resumo")}
                    variant="ghost contained"
                >
                    Resumo
                </Button>
            </div>
        </div>
    );
};

export default SelectEmp;