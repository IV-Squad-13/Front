import styles from "./SelectItem.module.css";

const SelectItem = ({onSelect, id, content}) => {
    return (
        <div className={styles.item} onClick={() => onSelect(id)}>
            <h1 className={styles.title}>{content}</h1>
        </div>
    );
};

export default SelectItem;