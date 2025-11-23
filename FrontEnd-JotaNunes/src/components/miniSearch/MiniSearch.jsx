import { useState, useRef, useEffect } from "react";
import styles from "./MiniSearch.module.css";

const MiniSearch = ({ 
    placeholder = "Buscar...", 
    results = [], 
    onSearch, 
    onChange, 
    constraintName 
}) => {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim()) {
            onSearch(value);
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const handleSelect = (item) => {
        setQuery(item.name || item.toString());
        setOpen(false);

        onChange({
            name: constraintName,
            value: item.value ?? item
        });
    };

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className={styles.wrapper} ref={ref}>
            <input
                className={styles.input}
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
                onFocus={() => query && results.length > 0 && setOpen(true)}
            />

            {open && results.length > 0 && (
                console.log(results),
                <div className={styles.dropdown}>
                    {results.map((item, idx) => (
                        <div
                            key={idx}
                            className={styles.item}
                            onClick={() => handleSelect(item)}
                        >
                            {item.name || item.id.toString()}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MiniSearch;