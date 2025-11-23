import Collapsible from '../collapsible/Collapsible';
import styles from './Dropdown.module.css';

const Dropdown = ({
    mode = "single_entity",
    options = [],
    selected,
    setSelected
}) => {

    const handleEntityToggle = (entity) => {
        if (mode === "single_entity") {
            setSelected(entity);
            return;
        }

        if (mode === "bulk") {
            const list = Array.isArray(selected) ? selected : [];
            const exists = list.some(s => s.id === entity.id);

            if (exists) {
                setSelected(list.filter(s => s.id !== entity.id));
            } else {
                setSelected([...list, entity]);
            }
        }
    };

    const handleFieldSelect = (entity, fieldName) => {
        setSelected({ entity, field: fieldName });
    };

    const isEntitySelected = (entity) => {
        if (mode === "single_entity") return selected?.id === entity.id;
        if (mode === "bulk") return Array.isArray(selected) && selected.some(s => s.id === entity.id);
        return false;
    };

    const isFieldSelected = (entity, fieldName) => (
        selected?.entity?.id === entity.id && selected?.field === fieldName
    );

    return (
        <div className={styles.dropdownWrapper}>
            {options.map((opt) => (
                <div key={opt.id || opt.name} className={styles.option}>

                    {(mode === "single_entity" || mode === "bulk") && (
                        <label className={styles.entityRow}>
                            <input
                                type={mode === "single_entity" ? "radio" : "checkbox"}
                                name="entitySelectGroup"
                                checked={isEntitySelected(opt)}
                                onChange={() => handleEntityToggle(opt)}
                            />
                            <span>{opt.name}</span>
                        </label>
                    )}

                    {mode === "single_field" && (
                        <Collapsible title={opt.name}>
                            {Object.keys(opt).map((field) => {
                                if (["id", "name"].includes(field)) return null;

                                return (
                                    <div key={field} className={styles.fieldOption}>
                                        <label className={styles.fieldWrapper}>
                                            <input
                                                type="radio"
                                                name="fieldSelectGroup"
                                                checked={isFieldSelected(opt, field)}
                                                onChange={() => handleFieldSelect(opt, field)}
                                                className={styles.fieldCheckbox}
                                            />
                                            <p className={styles.fieldLabel}>{field}</p>
                                        </label>
                                    </div>
                                );
                            })}
                        </Collapsible>
                    )}

                </div>
            ))}
        </div>
    );
};

export default Dropdown;