import { useState } from "react";
import styles from "./EmpreendimentoForm.module.css";

const EmpreendimentoForm = ({ title, onChange, creationType, onCreationTypeChange }) => {
    const creationOptions = ["PADRAO", "IMPORT", "AVULSO"];

    return (
        <div className={styles.formContainer}>
            
            <div className={styles.inputGroup}>
                <label htmlFor="title">Nome do Empreendimento</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={onChange}
                    placeholder="Digite o nome..."
                    className={styles.input}
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="creationType">Tipo de Criação</label>
                <select
                    id="creationType"
                    value={creationType}
                    onChange={onCreationTypeChange}
                    className={styles.select}
                >
                    <option className={styles.option} value="">Selecione...</option>
                    {creationOptions.map((opt) => (
                        <option className={styles.option} key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default EmpreendimentoForm;