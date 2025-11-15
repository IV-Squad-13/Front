import styles from "./EspecificacaoForm.module.css";

const EspecificacaoForm = ({ name, onNameChange, desc, onDescChange }) => {
    return (
        <div className={styles.formContainer}>
            <div className={styles.inputArea}>
                <label htmlFor="name">Nome da Especificação</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={onNameChange}
                    placeholder="Digite o nome..."
                />
            </div>

            <div className={styles.inputArea}>
                <label htmlFor="description">Descrição da Especificação</label>
                <textarea
                    id="description"
                    className={styles.descriptionInput}
                    value={desc}
                    onChange={onDescChange}
                    placeholder="Descreva a especificação..."
                />
            </div>
        </div>
    );
};

export default EspecificacaoForm;