import React from "react";

type Props = {
    onSelect: (id: number) => void;
    id: number;
    content: string;
}

const SelectItem = ({ onSelect, id, content }: Props) => {
    return (
        <div onClick={() => onSelect(id)}>
            <h1>{content}</h1>
        </div>
    );
};

export default SelectItem;