import { useState } from "react";
import styles from "./SearchBar.module.css";
import Button from "../button/Button";

const SearchBar = ({ title, onSearch, displayButton }) => {
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSearch(query);
        }
    };

    const handleClick = () => {
        onSearch(query);
    };

    return (
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
                />
            </div>

            <div className={styles.searchButtonContainer}>
                {displayButton && (
                    <Button type="button" onClick={handleClick} variant="header">
                        Buscar
                    </Button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;