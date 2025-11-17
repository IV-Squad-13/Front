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
    defaultValue = ""
}) => {
    const [query, setQuery] = useState(defaultValue);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    const handleInputChange = (e) => {
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
        if (e.key === "Enter") {
            onSearch(query);
            if (displayDropDown) setShowDropdown(true);
        }
    };

    const handleSelect = (item) => {
        setQuery(item.label || item.toString());
        if (displayDropDown) setShowDropdown(false);
        if (onSelect) onSelect(item);
    };

    useEffect(() => {
        if (!displayDropDown) return;

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [displayDropDown]);

    return (
        <div className={displayDropDown ? styles.searchWrapper : ""} ref={dropdownRef}>
            <div className={styles.searchBarContainer}>
                <div className={styles.searchContainer}>
                    <label className={styles.searchLabel}>{title}</label>

                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Buscar"
                        className={styles.searchInput}
                        onFocus={() =>
                            displayDropDown &&
                            query &&
                            results.length > 0 &&
                            setShowDropdown(true)
                        }
                    />
                </div>

                <div className={styles.searchButtonContainer}>
                    {displayButton && (
                        <Button type="button" onClick={() => onSearch(query)} variant="header">
                            Buscar
                        </Button>
                    )}
                </div>
            </div>

            {displayDropDown && showDropdown && results.length > 0 && (
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