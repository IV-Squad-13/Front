import { useMemo } from "react";

const useGroupedAssignment = (doc) => {
  const groupedAssignment = useMemo(() => {
    if (!doc) return { ambientes: { type: "ambiente", data: [] }, materiais: { type: "material", data: [] } };

    const locais = doc.locais ?? [];
    const materiais = doc.materiais ?? [];

    const ambientes = [];
    locais.forEach(local => {
      (local.ambientes ?? []).forEach(a => {
        ambientes.push({
          id_: a.id,
          docType_: "ambiente",
          localId_: local.id,
          localKey_: a.local,
          name: a.name,
          children: (a.items ?? []).map(item => ({
            id_: item.id,
            docType_: "item",
            ambienteId_: a.id,
            localId_: local.id,
            nome: ["name", item.name],
            tipo: ["type", item.type],
            desc: ["desc", item.desc],
          })),
        });
      });
    });

    const materiaisGroup = materiais.map(m => ({
      material: { id_: m.id, docType_: "material", nome: ["name", m.name] },
      marcas: (m.marcas ?? []).map(marca => ({ id_: marca.id, docType_: "marca", materialId_: m.id, nome: ["name", marca.name] })),
    }));

    return {
      ambientes: { type: "ambiente", data: ambientes },
      materiais: { type: "material", data: materiaisGroup },
    };
  }, [doc]);

  const filterByLocal = useMemo(() => (section, stepLocalKey) => {
    if (section !== "ambientes") return groupedAssignment[section] ?? { type_: "", data: [] };
    if (!stepLocalKey) return { type: groupedAssignment.ambientes.type, data: groupedAssignment.ambientes.data };

    return {
      type: groupedAssignment.ambientes.type,
      data: groupedAssignment.ambientes.data.filter(a => a.localKey_ === stepLocalKey),
    };
  }, [groupedAssignment]);

  return { groupedAssignment, filterByLocal };
}

export default useGroupedAssignment;
