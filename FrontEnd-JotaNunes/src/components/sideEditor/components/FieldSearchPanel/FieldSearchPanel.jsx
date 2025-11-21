import MiniSearch from "@/components/miniSearch/MiniSearch";
import React from "react";
import styles from "./FieldSearchPanel.module.css"

export default function FieldSearchPanel({ fields = [], onFieldTyping }) {
  return (
    <div className={styles.mainSearch}>
      {fields.map(f => (
        <div key={f} className={styles.fieldSearch}>
          <MiniSearch
            placeholder={`${f} de`}
            results={[]}
            constraintName={f}
            onSearch={v => onFieldTyping(f, v)}
            onChange={() => { }}
          />
        </div>
      ))}
    </div>
  );
}
