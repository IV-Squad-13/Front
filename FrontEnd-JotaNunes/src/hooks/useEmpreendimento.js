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
      if (!empId) {
        const created = await startProcess(empreendimento);
        setEmpId(created.id);
        setEmpreendimento(created);
        return { ok: true, data: created };
      }

      const updated = await updateEmpreendimento(empId, empreendimento, docLoadParams);
      setEmpreendimento(updated);
      return { ok: true, data: updated };
    } catch (err) {
      console.error("Erro ao salvar empreendimento", err);
      return { ok: false, error: err };
    }
  }, [empId, empreendimento]);

  const saveSpec = useCallback(async () => {
    try {
      const updatedDoc = await updateSpecification(empreendimento.doc, empreendimento.doc.id);

      setEmpreendimento(prev => ({
        ...prev,
        doc: {
          ...prev.doc,
          name: updatedDoc.name,
          desc: updatedDoc.desc,
        },
      }));

      return { ok: true, data: updatedDoc };
    } catch (err) {
      console.error("Erro ao salvar especificação", err);
      return { ok: false, error: err };
    }
  }, [empreendimento.doc]);

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