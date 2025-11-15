import styles from "./EmpreendimentoForm.module.css"

const EmpreendimentoForm = ({ title, onChange }) => {
    return (
        <div>
            <label htmlFor="title">Nome do Empreendimento</label>
            <input
                type="text"
                value={title}
                onChange={onChange}
            />
        </div>
    );
};

export default EmpreendimentoForm;