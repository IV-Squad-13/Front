import Dropdown from "@/components/dropdown/Dropdown";
import React from "react";
import styles from "./SearchResultsPanel.module.css";

export default function SearchResultsPanel({ mode, setMode, options, selected, setSelected }) {
  return (
    <>
      <div style={{ marginBottom: 8 }}>
        {/* Menu de opções de seleção (carregar associações, escolher apenas campo, etc.) */}
      </div>

      <Dropdown
        mode={mode}
        options={options}
        selected={selected}
        setSelected={setSelected}
      />
    </>
  );
}
