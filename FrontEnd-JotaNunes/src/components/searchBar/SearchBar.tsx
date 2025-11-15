import React, { useState, KeyboardEvent, ChangeEvent } from "react";

type Props = {
    title: string;
    onSearch: (query: string) => void;
    displayButton: boolean;
};

const SearchBar = ({ title, onSearch, displayButton }: Props) => {
    const [query, setQuery] = useState("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch(query);
        }
    };

    const handleClick = () => {
        onSearch(query);
    };

    return (
        <div>
            <label>{title}</label>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Buscar"
            />
            {displayButton && (
                <button
                    onClick={handleClick}
                >
                    Buscar
                </button>
            )}
        </div>
    );
};

export default SearchBar;
