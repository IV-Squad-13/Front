import { useState, useEffect, useRef } from "react";
import styles from "./SearchBar.module.css";
import Button from "../button/Button";

const SearchBar = ({
    title,
    onSearch,
    onSelect,
    displayDropDown = true,
    displayButton,
    results = [],
    defaultValue,
    disabled = false
}) => {
    const [query, setQuery] = useState(defaultValue ?? "");
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        setQuery(defaultValue ?? "");
    }, [defaultValue]);

    const handleInputChange = (e) => {
        if (disabled) return;
        const value = e.target.value;
        setQuery(value);

        if (!displayDropDown) return;

        if (value.trim().length > 0) {
            onSearch(value);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleKeyDown = (e) => {
        if (disabled) return;
        if (e.key === "Enter") {
            onSearch(query);
            if (displayDropDown) setShowDropdown(true);
        }
    };

    const handleSelect = (item) => {
        if (disabled) return;
        setQuery(item.label || item.toString());
        if (displayDropDown) setShowDropdown(false);
        if (onSelect) onSelect(item);
    };

    useEffect(() => {
        if (!displayDropDown || disabled) return;

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [displayDropDown, disabled]);

    return (
        <div
            className={`${displayDropDown ? styles.searchWrapper : ""} ${disabled ? styles.disabled : ""}`}
            ref={dropdownRef}
        >
            <div className={styles.searchBarContainer}>
                <div className={styles.searchContainer}>
                    {title && (<label className={styles.searchLabel}>{title}</label>)}

                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar"
                        className={styles.searchInput}
                        disabled={disabled}
                        onFocus={() =>
                            !disabled &&
                            displayDropDown &&
                            query &&
                            results.length > 0 &&
                            setShowDropdown(true)
                        }
                    />
                </div>

                {displayButton && (
                    <div className={styles.searchButtonContainer}>
                        <Button
                            type="button"
                            onClick={() => !disabled && onSearch(query)}
                            variant="header"
                            disabled={disabled}
                        >
                            Buscar
                        </Button>
                    </div>
                )}
            </div>

            {!disabled && displayDropDown && showDropdown && results.length > 0 && (
                <div className={styles.dropdown}>
                    {results.map((item, index) => (
                        <div
                            key={index}
                            className={styles.dropdownItem}
                            onClick={() => handleSelect(item)}
                        >
                            {item.label || item.toString()}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;