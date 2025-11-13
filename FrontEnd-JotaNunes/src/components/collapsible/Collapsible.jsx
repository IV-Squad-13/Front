import { useState } from "react";
import styles from "./Collapsible.module.css";

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.collapsible}>
      <button
        className={styles.header}
        onClick={() => setIsOpen((o) => !o)}
      >
        <span>{title}</span>
        <span className={`${styles.icon} ${isOpen ? styles.open : ""}`}>
          ▶
        </span>
      </button>

      <div className={`${styles.content} ${isOpen ? styles.open : ""}`}>
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
};

export default Collapsible;