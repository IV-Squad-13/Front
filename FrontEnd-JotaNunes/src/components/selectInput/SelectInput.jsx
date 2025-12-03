import styles from "./SelectInput.module.css";

const SelectInput = ({
    label,
    value,
    onChange,
    options = [],
    placeholder,
    disabled = false,
    id,
    variant = "",
    formatter = (o) => o,
    getId = (o) => o
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
                    value={String(value)} 
                    onChange={onChange}
                    disabled={disabled}
                >
                    {placeholder && (
                        <option value="">{placeholder}</option>
                    )}

                    {options.map((opt) => (
                        <option key={getId(opt)} value={getId(opt)}>
                            {formatter(opt)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SelectInput;