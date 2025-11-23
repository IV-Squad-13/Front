import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Carousel from "@/components/carousel/Carousel";
import Button from "@/components/button/Button";
import ContentBlock from "@/components/resumo/contentBlock/ContentBlock";
import useRevision from "@/hooks/useRevision";
import useEmpreendimento from "@/hooks/useEmpreendimento";
import styles from "./Resumo.module.css";
import { DocStatus } from "@/lib/revisionHelpers";
import { useAuth } from "@/context/AuthContext";
import DocInfoBlock from "@/components/resumo/docInfoBlock/DocInfoBlock";

const Resumo = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { empreendimento, loading: empLoading } = useEmpreendimento(id, user);

    const doc = empreendimento?.doc ?? null;
    const empId = empreendimento?.id ?? null;

    const rev = useRevision(empId, user, empreendimento?.users ?? []);
    const revision = rev?.revision ?? null;

    const specRev = useMemo(() => {
        if (!revision?.revDocs || !doc) return null;
        return revision.revDocs.find(
            (rd) => String(rd.revisedDocId) === String(doc.id)
        ) ?? null;
    }, [revision, doc]);

    const buildResumoBlocks = useCallback((doc, specRev) => {
        if (!doc) return [];

        const blocks = [];

        blocks.push({ type: "docInfo", doc, rev: specRev ?? null });

        const locaisList = doc.locais ?? [];
        const findLocal = (key) =>
            locaisList.find((l) => String(l.local) === String(key)) ?? null;

        const areaComumLocal = findLocal("AREA_COMUM");
        const unidadesLocal = findLocal("UNIDADES_PRIVATIVAS");
        const localRevs = specRev?.localRevs ?? [];

        blocks.push({
            type: "local",
            localEnum: "AREA_COMUM",
            locais: areaComumLocal?.ambientes ?? [],
            rev: localRevs.find((lr) => String(lr.revisedDocId) === String(areaComumLocal?.id)) ?? null,
        });

        blocks.push({
            type: "local",
            localEnum: "UNIDADES_PRIVATIVAS",
            locais: unidadesLocal?.ambientes ?? [],
            rev: localRevs.find((lr) => String(lr.revisedDocId) === String(unidadesLocal?.id)) ?? null,
        });

        blocks.push({
            type: "material",
            materiais: doc.materiais ?? [],
            rev: specRev ?? null,
        });

        return blocks;
    }, []);

    const blocks = useMemo(() => buildResumoBlocks(doc, specRev), [doc, specRev, buildResumoBlocks]);

    const [index, setIndex] = useState(0);
    useEffect(() => setIndex(0), [doc?.id]);

    const [viewMode, setViewMode] = useState("partial");

    const onPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
    const onNext = useCallback(() => setIndex((i) => Math.min(blocks.length - 1, i + 1)), [blocks.length]);

    const buildDto = useCallback((docType, field, value) => {
        const dto = { docType };

        if (!field || (docType === "ITEM" && field === "name")) {
            dto.isApproved = value;
        }

        const isolatedApproval = ["ITEM", "MARCA"]
        if (!isolatedApproval.includes(docType)) {
            dto.approvalType = "CASCADE";
        }

        switch (field) {
            case "name":
                dto.isNameApproved = value;
                break;
            case "desc":
                dto.isDescApproved = value;
                break;
            case "obs":
                dto.isObsApproved = value;
                break;
            case "type":
                dto.isTypeApproved = value;
                break;
            default:
                dto.isApproved = value;
        }

        return dto;
    }, []);

    const callUpdateRevDocAndReload = useCallback(
        async (revDocId, dto) => {
            if (!rev || !rev.updateRevDoc) {
                console.error("Revision hook not available");
                return { ok: false, error: new Error("Revision hook not available") };
            }
            if (!revDocId) {
                console.warn("No revision id provided", dto);
                return { ok: false, error: new Error("Missing rev doc id") };
            }

            try {
                const result = await rev.updateRevDoc(revDocId, dto);
                if (rev.load) await rev.load(empId);
                return { ok: true, data: result };
            } catch (err) {
                console.error("Error updating revision doc", err);
                return { ok: false, error: err };
            }
        },
        [rev, empId]
    );

    const handleSpecFieldApproval = useCallback(
        (specRevId, field, value) => {
            if (!specRevId) return Promise.resolve({ ok: false, error: new Error("missing id") });
            const dto = buildDto("ESPECIFICACAO", field, value);
            return callUpdateRevDocAndReload(specRevId, dto);
        },
        [buildDto, callUpdateRevDocAndReload]
    );

    const handleLocalApproval = useCallback(
        (localRevId, value) => callUpdateRevDocAndReload(localRevId, buildDto("LOCAL", undefined, value)),
        [callUpdateRevDocAndReload, buildDto]
    );

    const handleAmbienteApproval = useCallback(
        (ambRevId, value) => callUpdateRevDocAndReload(ambRevId, buildDto("AMBIENTE", undefined, value)),
        [callUpdateRevDocAndReload, buildDto]
    );

    const handleItemFieldApproval = useCallback(
        (itemRevId, value, field) => callUpdateRevDocAndReload(itemRevId, buildDto("ITEM", field, value)),
        [callUpdateRevDocAndReload, buildDto]
    );

    const handleMaterialApproval = useCallback(
        (matRevId, value) => callUpdateRevDocAndReload(matRevId, buildDto("MATERIAL", undefined, value)),
        [callUpdateRevDocAndReload, buildDto]
    );

    const handleMarcaApproval = useCallback(
        (marRevId, value) => callUpdateRevDocAndReload(marRevId, buildDto("MARCA", undefined, value)),
        [callUpdateRevDocAndReload, buildDto]
    );

    const handleSectionApproval = useCallback(
        async (localRevId, value, local) => {
            const isGlobalSection = !local;

            if (isGlobalSection && specRev?.materialRevs?.length > 0) {
                for (const material of specRev.materialRevs) {
                    await handleMaterialApproval(material.id, value);
                }
            }

            if (localRevId) {
                return handleLocalApproval(localRevId, value);
            } else {
                console.warn("Missing localRevId in sectionApproval");
                return { ok: false, error: new Error("missing localRevId") };
            }
        },
        [specRev, handleMaterialApproval, handleLocalApproval]
    );

    const handleRevisionRequest = useCallback(async () => {
        // TODO: criar modal para indicar revisor e regra ou não
        const reqDTO = {
            revisorId: 1,
            rule: "START_BY_ANYONE",
        };

        const r = await rev.request(reqDTO);
        if (r?.ok) await rev.load(empId);
    }, [rev, empId]);

    const handleStartRevision = useCallback(async () => {
        if (!user?.id) return;

        const r = await rev.start(user.id);
        if (r?.ok) await rev.load(empId);
    }, [rev, empId, user?.id]);

    const handleApproveRevision = useCallback(async () => {
        const r = await rev.approve();
        if (r?.ok) await rev.load(empId);
    }, [rev, empId]);

    const handleRejectRevision = useCallback(async () => {
        const r = await rev.reject();
        if (r?.ok) await rev.load(empId);
    }, [rev, empId]);


    const renderDocInfoBlock = (block) => {
        return (
            <DocInfoBlock
                doc={block.doc}
                rev={block.rev}
                onFieldApproval={handleSpecFieldApproval}
            />
        );
    };

    const renderLocaisBlock = (block) => {
        return (
            <ContentBlock
                key={block.localEnum}
                functions={{
                    sectionApproval: (revId, value, local) => handleSectionApproval(revId, value, local),
                    ambienteApproval: (revId, value) => handleAmbienteApproval(revId, value),
                    itemFieldApproval: (revId, value, field) => handleItemFieldApproval(revId, value, field),
                }}
                content={{
                    secId: block.rev?.id ?? null,
                    local: block.localEnum,
                    status: block.rev ? (block.rev.isApproved === null ? DocStatus.UNSET : (block.rev.isApproved ? DocStatus.APROVADO : DocStatus.REJEITADO)) : DocStatus.UNSET,
                    data: block.locais,
                }}
                revStructure={block.rev}
                pageSize={10}
                enablePagination={true}
            />
        );
    };

    const renderMateriaisBlock = (block) => {
        return (
            <ContentBlock
                key="materiais"
                functions={{
                    sectionApproval: (revId, value) => handleSectionApproval(revId, value, null),
                    materialApproval: (revId, value) => handleMaterialApproval(revId, value),
                    marcaApproval: (revId, value) => handleMarcaApproval(revId, value),
                }}
                content={{ data: block.materiais }}
                revStructure={
                    block.rev
                        ? { materialRevs: block.rev.materialRevs, id: block.rev?.id ?? null, isApproved: block.rev.isApproved }
                        : null
                }
                pageSize={10}
                enablePagination={true}
            />
        );
    };

    const renderBlock = (block) => {
        switch (block.type) {
            case "docInfo":
                return renderDocInfoBlock(block);
            case "local":
                return renderLocaisBlock(block);
            case "material":
                return renderMateriaisBlock(block);
            default:
                return <div className={styles.unknown}>Bloco desconhecido</div>;
        }
    };

    if (empLoading) {
        return <div className={styles.loading}>Carregando empreendimento...</div>;
    }

    if (!doc) {
        return <div className={styles.empty}>Documento não encontrado.</div>;
    }

    return (
        <div className={styles.resumoPage}>
            <div className={styles.topbar}>
                <div className={styles.identification}>
                    <div>
                        <h1 className={styles.title}>{empreendimento?.name ?? "Empreendimento"}</h1>
                        <p className={styles.subTitle}>{doc?.name ?? "Especificação"}</p>
                    </div>
                    <div className={styles.meta}>
                        <span className={styles.modeTag}>{viewMode === "partial" ? "Visão parcial" : "Visão completa"}</span>
                        {specRev && <span className={styles.small}>Revisão: #{specRev.id}</span>}
                    </div>
                </div>

                <div className={styles.topActions}>
                    <div className={styles.viewToggle}>
                        <Button variant={viewMode === "partial" ? "primary contained" : "ghost contained"} onClick={() => setViewMode("partial")}>Parcial</Button>
                        <Button variant={viewMode === "full" ? "primary contained" : "ghost contained"} onClick={() => setViewMode("full")}>Tela Inteira</Button>
                    </div>

                    {/*                     
                    <div className={styles.actionGroup}>
                        <Button variant="secondary small" onClick={() => setIndex(0)}>Ir ao início</Button>
                        <Button variant="outline small" onClick={() => { setIndex(blocks.length - 1); setViewMode("partial"); }}>Ir ao fim</Button>
                    </div> 
                    */}
                </div>
            </div>

            <main className={styles.main}>
                {viewMode === "partial" ? (
                    <div className={styles.carouselWrap}>
                        <Carousel
                            blocks={blocks}
                            index={index}
                            onPrev={onPrev}
                            onNext={onNext}
                            render={(b) => <div className={styles.blockWrapper}>{renderBlock(b)}</div>}
                        />

                        <div className={styles.carouselFooter}>
                            <div className={styles.counter}>{index + 1} / {blocks.length}</div>
                            <div className={styles.carouselNav}>
                                <Button variant="ghost" onClick={onPrev}>Anterior</Button>
                                <Button variant="ghost" onClick={onNext}>Próximo</Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.fullView}>
                        {blocks.map((b, i) => (
                            <div key={i} className={styles.blockWrapper}>
                                {renderBlock(b)}
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <footer className={styles.footer}>
                {empreendimento.status === "ELABORACAO" && !revision && (
                    <Button
                        type="button"
                        variant="primary small contained"
                        onClick={handleRevisionRequest}
                    >
                        Encaminhar para Revisão
                    </Button>
                )}

                {revision?.status === "PENDENTE" && (
                    <Button
                        type="button"
                        variant="primary small contained"
                        onClick={handleStartRevision}
                    >
                        Iniciar Revisão
                    </Button>
                )}

                {revision?.status === "INICIADA" && (
                    <>
                        <Button
                            type="button"
                            variant="primary small contained"
                            onClick={handleRejectRevision}
                        >
                            Reenviar para Elaboração
                        </Button>

                        <Button
                            type="button"
                            variant="primary small contained"
                            onClick={handleApproveRevision}
                        >
                            Finalizar Documento
                        </Button>
                    </>
                )}
            </footer>
        </div>
    );
};

export default Resumo;