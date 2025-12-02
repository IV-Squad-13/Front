import React, { useMemo } from "react";
import styles from "./ItemRow.module.css";
import Button from "@/components/button/Button";

const ItemRow = ({
    functions,
    docType,
    comment,
    fieldLabel,
    field,
    fieldRev = null,
    revId = null,
    fieldName = null,
}) => {
    const fn = useMemo(() => {
        if (!functions) {
            return null;
        }

        return docType === "ITEM"
            ? functions.itemFieldApproval
            : functions.marcaApproval;
    }, [docType, functions]);

    const handleApproval = (approve) => {
        if (!fn) return;

        fn(revId, approve, fieldName ?? field);
    };

    return (
        <div className={styles.itemContent}>
            <div className={styles.itemIdentifier}>
                {/* <span>
                    {fieldLabel && <p>{`${fieldLabel}: `}</p>}
                </span> */}
                <span>
                    <p>{field}</p>
                </span>
            </div>

            <div className={styles.itemStatusContainer}>
                {fieldRev && fn && revId && (
                    <div className={styles.itemBtnContainer}>
                        {comment && (
                            <Button onClick={() => console.log(comment)}>Comentário</Button>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleApproval(false)}
                        >Rejeitar</Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleApproval(true)}
                        >Aprovar</Button>
                    </div>
                )}
                {revId && (
                    <div className={styles.status}>
                        {fieldRev && <p>{fieldRev}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemRow;