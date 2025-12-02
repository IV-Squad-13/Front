import React, { useEffect, useMemo, useState } from "react";
import styles from "./MaterialContent.module.css";
import Button from "@/components/button/Button";
import ItemRow from "../itemRow/ItemRow";
import { DocStatus, isApproved } from "@/lib/revisionHelpers";

const MaterialContent = ({ functions, material, revStructure }) => {
    const status = useMemo(
        () => isApproved(revStructure ?? {}, "isApproved"),
        [revStructure]
    );

    const marcaStatusMap = useMemo(() => {
        const map = {};
        material?.marcas?.forEach((marca) => {
            const rev = revStructure?.marcaRevs?.find(
                (mr) => String(mr.revisedDocId) === String(marca.id)
            );
            map[marca.id] = {
                status: isApproved(rev ?? {}, "isApproved"),
                comment: rev?.comment ?? "",
                revId: rev?.id ?? null,
            };
        });
        return map;
    }, [material, revStructure]);

    return (
        <div className={styles.materialContainer}>
            <div className={styles.contentHeader}>
                <div className={styles.materialIdentifier}>
                    <p>{material?.name}</p>
                    {revStructure && <p>{status}</p>}
                </div>

                {revStructure && functions && (
                    <div className={styles.btnContainer}>
                        {revStructure.comment && (
                            <Button onClick={() => console.log(revStructure.comment)}>
                                Comentário
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => functions.materialApproval(revStructure.id, false)}
                        >
                            Rejeitar
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => functions.materialApproval(revStructure.id, true)}
                        >
                            Aprovar
                        </Button>
                    </div>
                )}
            </div>

            <div className={styles.contentChildren}>
                {material?.marcas?.map((marca) => {
                    const mapEntry = marcaStatusMap[marca.id];
                    return (
                        <div key={marca.id} className={styles.marcaContainer}>
                            <ItemRow
                                docType="MARCA"
                                functions={functions}
                                comment={mapEntry.comment}
                                field={marca.name}
                                fieldRev={mapEntry.status}
                                revId={mapEntry.revId}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MaterialContent;