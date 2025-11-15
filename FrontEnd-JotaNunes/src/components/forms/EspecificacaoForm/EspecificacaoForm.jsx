import styles from "./EspecificacaoForm"

const EspecificacaoForm = ({ name, onNameChange, desc, onDescChange }) => {
    return (
        <div>
            <div>
                <label htmlFor="name">Nome da Especificação</label>
                <input
                    type="text"
                    value={name}
                    onChange={onNameChange}
                />
            </div>
            <div className={styles.inputArea}>
                <label htmlFor="description">Descrição da Especificação</label>
                <textarea
                    className={styles.descriptionInput}
                    value={desc}
                    onChange={onDescChange}
                />
            </div>
        </div>
    );
}

export default EspecificacaoForm;