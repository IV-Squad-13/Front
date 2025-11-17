import styles from "./EspecificacaoForm.module.css";

const EspecificacaoForm = ({ emp, setEmp }) => {
    const doc = emp.doc || { name: "", desc: "" };

    const updateDoc = (field, value) => {
        setEmp({
            ...emp,
            doc: {
                ...doc,
                [field]: value
            }
        });
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.inputArea}>
                <label htmlFor="name">Nome da Especificação</label>
                <input
                    id="name"
                    type="text"
                    value={doc.name}
                    onChange={(e) => updateDoc("name", e.target.value)}
                    placeholder="Digite o nome..."
                />
            </div>

            <div className={styles.inputArea}>
                <label htmlFor="description">Descrição da Especificação</label>
                <textarea
                    id="description"
                    className={styles.descriptionInput}
                    value={doc.desc}
                    onChange={(e) => updateDoc("desc", e.target.value)}
                    placeholder="Descreva a especificação..."
                />
            </div>
        </div>
    );
};

export default EspecificacaoForm;