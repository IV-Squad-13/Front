import { useEffect, useState, useCallback, useMemo } from "react";
import {
    getRevisionByEmpId,
    requestRevision,
    startRevision,
    sendRevision,
    updateRevisionDoc,
} from "@/services/RevisionService";

const docLoadParams = {
    loadEmpreendimento: true,
    loadLocais: true,
    loadAmbientes: true,
    loadItems: true,
    loadMateriais: true,
    loadMarcas: true,
};

const useRevision = (empId, user, participants) => {
    const [revision, setRevision] = useState(null);
    const [loading, setLoading] = useState(false);

    const load = useCallback(
        async (idToLoad = empId) => {
            if (!idToLoad) return null;

            setLoading(true);
            try {
                const data = await getRevisionByEmpId(idToLoad, docLoadParams);
                setRevision(data);
                return data;
            } catch (err) {
                console.error("Erro ao carregar revisão", err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [empId, participants]
    );

    useEffect(() => {
        if (empId) load(empId);
    }, [empId, load]);

    const request = useCallback(
        async (dto) => {
            if (!empId) {
                return { ok: false, error: "empreendimento não fornecido" };
            }

            try {
                const updated = await requestRevision(empId, dto);
                setRevision(updated);
                return { ok: true, data: updated };
            } catch (err) {
                console.error("Erro ao solicitar revisão", err);
                return { ok: false, error: err };
            }
        },
        [empId]
    );

    const start = useCallback(
        async (revisorId) => {
            if (!revision?.id) return { ok: false, error: "revisão não fornecida" };

            try {
                const updated = await startRevision(revision.id, revisorId, docLoadParams);
                setRevision(updated);
                return { ok: true, data: updated };
            } catch (err) {
                console.error("Erro ao iniciar revisão", err);
                return { ok: false, error: err };
            }
        },
        [revision?.id]
    );

    const approve = useCallback(async () => {
        if (!revision?.id) return;

        try {
            await sendRevision(revision.id, "approve");
            return { ok: true };
        } catch (err) {
            console.error("Erro ao aprovar revisão", err);
            return { ok: false, error: err };
        }
    }, [revision?.id]);

    const reject = useCallback(async () => {
        if (!revision?.id) return;

        try {
            await sendRevision(revision.id, "reject");
            return { ok: true };
        } catch (err) {
            console.error("Erro ao rejeitar revisão", err);
            return { ok: false, error: err };
        }
    }, [revision?.id]);

    const updateRevDoc = useCallback(
        async (docId, dto) => {
            try {
                const updatedDoc = await updateRevisionDoc(docId, dto);
                return { ok: true, data: updatedDoc };
            } catch (err) {
                console.error("Erro ao atualizar documento de revisão", err);
                return { ok: false, error: err };
            }
        },
        []
    );

    const editingDisabled = useMemo(() => {
        if (!participants || !revision) return false;

        const userAccesses = participants
            .filter((p) => p.user.id === user.id)
            .map((p) => p.access);

        const isFinished = ["APROVADA", "REJEITADA"].includes(revision.status);
        const isRevisor = userAccesses.includes("REVISOR") 
            ? !isFinished
            : false;
    
        return !isRevisor && isFinished;
    }, [participants, revision, user.id]);

    const base = { revision, loading, load, request };

    if (editingDisabled) {
        return base;
    }

    return {
        ...base,
        setRevision,
        start,
        approve,
        reject,
        updateRevDoc,
    };
};

export default useRevision;