import React from "react";
import Button from "@/components/button/Button";
import styles from "@/pages/Resumo/Resumo.module.css";
import { DocStatus } from "@/lib/revisionHelpers";

const DocInfoBlock = ({ doc, rev, onFieldApproval }) => {
    const statusStr = rev
        ? rev.isApproved === null
            ? DocStatus.UNSET
            : rev.isApproved
                ? DocStatus.APROVADO
                : DocStatus.REJEITADO
        : DocStatus.UNSET;

    const renderFieldRow = (label, value, fieldName, fieldApprovalValue) => (
        <div className={styles.fieldRow}>
            <strong>{label}</strong>
            <div className={styles.fieldValue}>
                <span>{value ?? "—"}</span>

                {rev && (
                    <div className={styles.fieldActions}>
                        <span className={styles.smallStatus}>
                            {fieldApprovalValue === null
                                ? DocStatus.UNSET
                                : fieldApprovalValue
                                    ? DocStatus.APROVADO
                                    : DocStatus.REJEITADO}
                        </span>

                        <div className={styles.revBtns}>
                            <Button
                                variant="ghost contained"
                                onClick={() => onFieldApproval(rev.id, fieldName, false)}
                            >
                                Rejeitar
                            </Button>

                            <Button
                                variant="ghost contained"
                                onClick={() => onFieldApproval(rev.id, fieldName, true)}
                            >
                                Aprovar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <section className={styles.docInfoBlock}>
            <header className={styles.headerRow}>
                <div className={styles.titleWrap}>
                    <h2 className={styles.docTitle}>{doc?.name}</h2>
                    <p className={styles.docMeta}>
                        {doc?.subTitle ?? `Documento #${doc?.id ?? ""}`}
                    </p>
                </div>

                <div className={styles.controls}>
                    {rev && <span className={styles.statusTag}>Status: {statusStr}</span>}

                    {rev && (
                        <div className={styles.actionBtns}>
                            <Button
                                variant="ghost contained"
                                onClick={() => onFieldApproval(rev.id, undefined, false)}
                            >
                                Rejeitar documento
                            </Button>

                            <Button
                                variant="ghost contained"
                                onClick={() => onFieldApproval(rev.id, undefined, true)}
                            >
                                Aprovar documento
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            <div className={styles.docFields}>
                {renderFieldRow("Nome", doc?.name, "name", rev?.isNameApproved)}
                {renderFieldRow("Descrição", doc?.desc, "desc", rev?.isDescApproved)}
                {renderFieldRow("Observações", doc?.obs, "obs", rev?.isObsApproved)}
            </div>
        </section>
    );
};

export default DocInfoBlock;