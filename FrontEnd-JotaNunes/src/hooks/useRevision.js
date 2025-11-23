import { useEffect, useState, useCallback } from "react";
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
                if (!data) throw new Error("Revision not found");

                setRevision(data);
                return data;
            } catch (err) {
                console.error("Erro ao carregar revisão", err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [empId]
    );

    useEffect(() => {
        if (empId) load(empId);
    }, [empId, load]);

    const request = useCallback(
        async (dto) => {
            if (!empId) return { ok: false, error: "empreendimento não fornecido" };

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
                const updated = await startRevision(
                    revision.id,
                    revisorId,
                    docLoadParams
                );
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

    if (participants) {
        const userAccesses = participants
            .filter((part) => part.user.id === user.id)
            .map((part) => part.access);

        if (!userAccesses.includes("REVISOR")) {
            return {
                revision,
                loading,
                load,
                request
            }
        }
    }

    return {
        revision,
        setRevision,
        loading,
        load,

        request,
        start,
        approve,
        reject,
        updateRevDoc,
    };
};

export default useRevision;