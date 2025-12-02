import styles from "./SelectInput.module.css";

const SelectInput = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Selecione...",
    disabled = false,
    id,
    variant = ""
}) => {

    const selectClassName = [
        styles.wrapper,
        ...variant.split(" ").map(v => styles[v])
    ].join(" ");

    return (
        <div className={selectClassName}>
            {label && <label htmlFor={id}>{label}</label>}

            <div className={`${styles.selectContainer} ${disabled ? styles.disabled : ""}`}>
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                >
                    <option value="">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SelectInput;
