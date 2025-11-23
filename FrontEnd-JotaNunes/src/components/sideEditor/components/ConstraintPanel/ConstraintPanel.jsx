import React from "react";
import styles from "./ConstraintPanel.module.css"
import MiniSearch from "@/components/miniSearch/MiniSearch";

export default function ConstraintPanel({ constraints = [], onSearch, onSelect }) {
  return (
    <div className={styles.constraintMenu}>
      {constraints.map(c => (
        <div key={c.name} className={styles.constraintRow}>
          <MiniSearch
            placeholder={c.label}
            results={c.results}
            constraintName={c.name}
            onSearch={v => onSearch(c.name, v)}
            onChange={onSelect}
            disabled={c.fixedValue != null}
            defaultValue={c.fixedValue}
          />
        </div>
      ))}
    </div>
  );
}
