import React, { useState, useMemo } from "react";
import AmbienteContent from "../ambienteContent/AmbienteContent";
import MaterialContent from "../materialContent/MaterialContent";
import styles from "./ContentBlock.module.css";
import Button from "@/components/button/Button";

const ContentBlock = ({
    functions,
    content,
    revStructure,
    pageSize = 10,
    enablePagination = true,
}) => {
    const isLocal = typeof content.local !== "undefined";

    const [page, setPage] = useState(0);
    const total = content.data?.length ?? 0;

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const paginatedData = useMemo(() => {
        if (!enablePagination) return content.data;
        const start = page * pageSize;
        const end = start + pageSize;
        return content.data.slice(start, end);
    }, [content.data, page, pageSize, enablePagination]);

    const nextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));
    const prevPage = () => setPage((p) => Math.max(0, p - 1));

    const Header = () => (
        <div className={styles.sectionTitle}>
            {isLocal ? (
                <>
                    <p>{content.local}</p>
                    {content.secId && (<p>{content.status}</p>)}
                </>
            ) : (
                <h1>Materiais</h1>
            )}

            {content.secId && functions && (
                <div className={styles.fnContainer}>
                    <Button
                        type="button"
                        variant="ghost contained"
                        onClick={() => functions.sectionApproval(content.secId, false, content.local ?? null)}
                    >
                        Rejeitar Seção
                    </Button>
                    <Button
                        type="button"
                        variant="ghost contained"
                        onClick={() => functions.sectionApproval(content.secId, true, content.local ?? null)}
                    >
                        Aprovar Seção
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <div className={styles.blockContent}>
            <Header />

            <div className={styles.content}>
                {paginatedData?.map((node) => {
                    if (isLocal) {
                        const ambRev =
                            revStructure?.ambienteRevs?.find(
                                (a) => String(a.revisedDocId) === String(node.id)
                            ) ?? null;

                        return (
                            <AmbienteContent
                                key={node.id}
                                ambiente={node}
                                revStructure={ambRev}
                                functions={functions}
                            />
                        );
                    }

                    const materialRev =
                        revStructure?.materialRevs?.find(
                            (m) => String(m.revisedDocId) === String(node.id)
                        ) ?? null;

                    return (
                        <MaterialContent
                            key={node.id}
                            material={node}
                            revStructure={materialRev}
                            functions={functions}
                        />
                    );
                })}
            </div>

            {enablePagination && total > pageSize && (
                <div className={styles.paginationFooter}>
                    <Button variant="ghost contained" onClick={prevPage} disabled={page === 0}>
                        Anterior
                    </Button>

                    <span className={styles.pageIndicator}>
                        Página {page + 1} de {totalPages}
                    </span>

                    <Button variant="ghost contained" onClick={nextPage} disabled={page === totalPages - 1}>
                        Próxima
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ContentBlock;