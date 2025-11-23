import React, { useMemo } from "react";
import styles from "./AmbienteContent.module.css";
import Button from "@/components/button/Button";
import ItemRow from "../itemRow/ItemRow";
import { DocStatus, isApproved } from "@/lib/revisionHelpers";

const AmbienteContent = ({ ambiente, revStructure, functions }) => {
    const status = useMemo(
        () => isApproved(revStructure ?? {}, "isApproved"),
        [revStructure]
    );

    const itemStatusMap = useMemo(() => {
        const map = {};
        ambiente?.items?.forEach((item) => {
            const rev = revStructure?.itemRevs?.find(
                (ir) => String(ir.revisedDocId) === String(item.id)
            );

            map[item.id] = {
                nameStatus: isApproved(rev ?? {}, "isApproved"),
                descStatus: isApproved(rev ?? {}, "isDescApproved"),
                typeStatus: isApproved(rev ?? {}, "isTypeApproved"),
                comment: rev?.comment ?? "",
                revId: rev?.id ?? null,
            };
        });
        return map;
    }, [ambiente, revStructure]);

    return (
        <div className={styles.ambienteContainer}>
            <div className={styles.contentHeader}>
                <div className={styles.ambienteIdentifier}>
                    <p>{ambiente?.name}</p>
                    {revStructure && <p>{status}</p>}
                </div>

                {revStructure && (
                    <div className={styles.btnContainer}>
                        {revStructure.comment && (
                            <Button onClick={() => console.log(revStructure.comment)}>
                                Comentário
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                                functions.ambienteApproval(revStructure.id ?? ambiente.id, false)
                            }
                        >
                            Rejeitar
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                                functions.ambienteApproval(revStructure.id ?? ambiente.id, true)
                            }
                        >
                            Aprovar
                        </Button>
                    </div>
                )}
            </div>

            <div className={styles.contentChildren}>
                {ambiente?.items?.map((item) => {
                    const entry = itemStatusMap[item.id];

                    return (
                        <div key={item.id} className={styles.itemContainer}>
                            <div className={styles.itemRow}>
                                <ItemRow
                                    fieldLabel="Nome"
                                    docType="ITEM"
                                    functions={functions}
                                    field={item.name}
                                    comment={entry.comment}
                                    fieldRev={entry.nameStatus}
                                    revId={entry.revId}
                                    fieldName="name"
                                />
                            </div>

                            <div className={styles.itemFieldContainer}>
                                {["desc", "type"].map((f) => (
                                    <ItemRow
                                        key={f}
                                        fieldLabel={f === "desc" ? "Descrição" : "Tipo"}
                                        docType="ITEM"
                                        functions={functions}
                                        field={item[f]}
                                        fieldRev={entry[`${f}Status`]}
                                        revId={entry.revId}
                                        fieldName={f}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AmbienteContent;