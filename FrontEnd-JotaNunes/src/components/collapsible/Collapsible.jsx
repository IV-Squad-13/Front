import { useState, useRef, useEffect } from "react";
import styles from "./Collapsible.module.css";

const Collapsible = ({ title, children, titleStyle = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.header}
        onClick={toggle}
      >
        <span className={titleStyle}>{title}</span>
        <span className={styles.icon}>{isOpen ? "▾" : "▸"}</span>
      </div>

      <div
        className={styles.content}
        style={{ height }}
      >
        <div ref={contentRef} className={styles.inner}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Collapsible;