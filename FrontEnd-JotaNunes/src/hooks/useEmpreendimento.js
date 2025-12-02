import { useEffect, useState, useCallback } from "react";
import {
  getEmpreendimentoById,
  startProcess,
  updateEmpreendimento,
  updateSpecification,
} from "@/services/SpecificationService";

const INITIAL_DOC = { name: "", desc: "" };
const docLoadParams = {
  loadEspecificacao: true,
  loadLocais: true,
  loadAmbientes: true,
  loadItems: true,
  loadMateriais: true,
  loadMarcas: true,
};

const useEmpreendimento = (initialId, user) => {
  const [empreendimento, setEmpreendimento] = useState(() => ({
    name: "",
    init: "",
    creatorId: user?.id ?? null,
    doc: INITIAL_DOC,
  }));

  const [loading, setLoading] = useState(false);
  const [empId, setEmpId] = useState(initialId || null);

  const load = useCallback(
    async (idToLoad = initialId) => {
      if (!idToLoad) return null;
      setLoading(true);
      try {
        const data = await getEmpreendimentoById(idToLoad, docLoadParams);
        if (!data) throw new Error("Not found");

        const normalized = {
          ...data,
          name: data.name ?? "",
          init: data.init ?? "",
          doc: data.doc ?? INITIAL_DOC,
        };

        setEmpreendimento(normalized);
        setEmpId(normalized.id);
        return normalized;
      } catch (err) {
        console.error("Nenhum Empreendimento encontrado", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [initialId]
  );

  useEffect(() => {
    if (initialId) load(initialId);
  }, [initialId, load]);

  const saveEmp = useCallback(async () => {
    try {
      let saved;

      if (!empId) {
        saved = await startProcess(empreendimento);
        setEmpId(saved.id);
      } else {
        saved = await updateEmpreendimento(empId, empreendimento, docLoadParams);
      }

      const reloaded = await load(saved.id);

      return { ok: true, data: reloaded };
    } catch (err) {
      console.error("Erro ao salvar empreendimento", err);
      return { ok: false, error: err };
    }
  }, [empId, empreendimento, load]);

  const saveSpec = useCallback(async () => {
    try {
      const updatedDoc = await updateSpecification(
        empreendimento.doc,
        empreendimento.doc.id
      );

      const reloaded = await load(empreendimento.id);

      return { ok: true, data: reloaded };
    } catch (err) {
      console.error("Erro ao salvar especificação", err);
      return { ok: false, error: err };
    }
  }, [empreendimento.doc, empreendimento.id, load]);

  return {
    empreendimento,
    setEmpreendimento,
    empId,
    setEmpId,
    loading,
    load,
    saveEmp,
    saveSpec,
  };
}

export default useEmpreendimento;