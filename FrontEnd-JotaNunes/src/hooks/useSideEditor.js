import { useCallback, useEffect, useMemo, useState } from "react";
import { getCatalogSearch } from "@/services/CatalogService";
import { addDocElementBulk, addRawDocElement, searchDocElement, searchEspecificacao } from "@/services/SpecificationService";
import { updateElementInDoc } from "@/lib/deepUpdateHelper";

const RESOURCE_MAP = {
    ambiente: { rel: "item", fields: ["name"] },
    item: { rel: "ambiente", fields: ["name", "desc"] },
    material: { rel: "marca", fields: ["name"] },
    marca: { rel: "material", fields: ["name"] }
};

const TABS = [
    { name: "catalogo", label: "Catálogo" },
    { name: "doc", label: "Documento" }
];

const flattenNewDocsForType = (newDocs, typeKey) => {
    if (!newDocs) return [];
    const payload = newDocs[typeKey];
    if (!payload) {
        const allValues = Object.values(newDocs).flatMap(v => (Array.isArray(v) ? v : []));
        return allValues;
    }
    return Array.isArray(payload) ? payload : [payload];
};

export function useSideEditor({ elementToAdd, parent, local, specId, setEmp }) {
    const [currentTab, setCurrentTab] = useState("catalogo");
    const [queryFields, setQueryFields] = useState({});
    const [constraints, setConstraints] = useState([]);
    const [resourceOptions, setResourceOptions] = useState([]);
    const [selectedMode, setSelectedMode] = useState("bulk");
    const [selectedElement, setSelectedElement] = useState(null);
    const [loading, setLoading] = useState(false);

    const fields = RESOURCE_MAP[elementToAdd]?.fields ?? [];

    const buildConstraints = useCallback(() => {
        const base = [
            { name: "padrao", label: "Padrão" },
            { name: RESOURCE_MAP[elementToAdd].rel, label: "Relação" }
        ];
        if (currentTab === "doc") base.push({ name: "refDoc", label: "Referência" });

        return base.map(c => ({ ...c, results: [], isVisible: true }));
    }, [elementToAdd, currentTab]);

    useEffect(() => {
        setConstraints(buildConstraints());
        setQueryFields({});
        setResourceOptions([]);
        setSelectedElement(null);
    }, [buildConstraints, currentTab, elementToAdd, local]);

    const handleConstraintSearch = useCallback(async (name, value) => {
        let results = [];
        if (currentTab === "catalogo") {
            results = await getCatalogSearch(name, { name: value });
        } else if (name === "refDoc") {
            results = await searchEspecificacao({ name: value });
        } else {
            results = await searchDocElement({ name: value });
        }

        setConstraints(prev => prev.map(c => (c.name === name ? { ...c, results } : c)));
    }, [currentTab]);

    const handleConstraintSelect = useCallback(({ name, value }) => {
        setQueryFields(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleFieldTyping = useCallback((field, value) => {
        setQueryFields(prev => ({ ...prev, [field]: value }));
    }, []);

    const submitSearch = useCallback(async () => {
        setLoading(true);
        try {
            const type = elementToAdd.toUpperCase();
            const extraLocalFilter = elementToAdd === "ambiente" ? { local } : {};

            const payload = currentTab === "catalogo"
                ? { ...queryFields, ...extraLocalFilter }
                : { ...queryFields, docType: type, ...extraLocalFilter };

            const results = currentTab === "catalogo"
                ? await getCatalogSearch(elementToAdd, payload)
                : await searchDocElement(payload);

            setResourceOptions(results || []);
        } finally {
            setLoading(false);
        }
    }, [elementToAdd, currentTab, queryFields, local]);

    const cleanSearch = useCallback(() => {
        setQueryFields({});
        setResourceOptions([]);
        setSelectedElement(null);
        setConstraints(buildConstraints());
    }, [buildConstraints]);

    const handleAdd = useCallback(async () => {
        if (!selectedElement || (Array.isArray(selectedElement) && selectedElement.length === 0)) {
            alert("Nenhum item selecionado.");
            return;
        }

        const type = elementToAdd.toUpperCase();
        const parentId = parent?.id_ ?? null;

        setLoading(true);
        if (currentTab === "catalogo") {
            let elementsPayload = [];
            if (selectedMode === "single_entity") {
                const element = Array.isArray(selectedElement) ? selectedElement[0] : selectedElement;
                elementsPayload = [{ type: type, elementId: element.id, parentId }];
            } else {
                elementsPayload = (Array.isArray(selectedElement) ? selectedElement : [selectedElement]).map(elmt => ({
                    type: type,
                    elementId: elmt.id,
                    parentId
                }));
            }

            try {
                const newDocs = await addDocElementBulk({ elements: elementsPayload }, specId);

                const newElements = flattenNewDocsForType(newDocs, type);

                setEmp(prev => ({
                    ...prev,
                    doc: updateElementInDoc(
                        prev.doc,
                        {
                            docType_: elementToAdd,
                            localId_: parent?.localId_ ?? null,
                            local: local,
                            ambienteId_: parent?.id_ ?? null,
                            materialId_: parent?.id_ ?? null,
                            id_: null
                        },
                        null,
                        false,
                        null,
                        newElements
                    )
                }));

                setResourceOptions([]);
                setSelectedElement(null);
                setQueryFields({});
            } catch (err) {
                console.error("Erro ao adicionar elementos:", err);
                alert("Erro ao adicionar elementos");
            } finally {
                setLoading(false);
            }
        } else if (currentTab === "doc") {
            let rawDocsPayload = [];

            const list = Array.isArray(selectedElement) ? selectedElement : [selectedElement];

            rawDocsPayload = list.map(elmt => ({
                name: elmt.name,
                docType: elementToAdd.toUpperCase(),
                catalogId: elmt.catalogId ?? null,
                local: local ?? null,
                desc: elmt.desc ?? null,
                typeId: elmt.typeId ?? null,

                parentId
            }));

            try {
                const newDocs = await Promise.all(
                    rawDocsPayload.map(payload => addRawDocElement(payload, specId))
                );

                setEmp(prev => ({
                    ...prev,
                    doc: updateElementInDoc(
                        prev.doc,
                        {
                            docType_: elementToAdd,
                            localId_: parent?.localId_ ?? null,
                            local: local,
                            ambienteId_: parent?.id_ ?? null,
                            materialId_: parent?.id_ ?? null,
                            id_: null
                        },
                        null,
                        false,
                        null,
                        newDocs
                    )
                }));

                setResourceOptions([]);
                setSelectedElement(null);
                setQueryFields({});

            } catch (err) {
                console.error("Erro ao adicionar elementos:", err);
                alert("Erro ao adicionar elementos");
            } finally {
                setLoading(false);
            }
        }

    }, [selectedElement, selectedMode, elementToAdd, parent, local, specId, setEmp]);

    return {
        TABS,
        currentTab,
        setCurrentTab,
        constraints,
        handleConstraintSearch,
        handleConstraintSelect,
        fields,
        queryFields,
        handleFieldTyping,
        submitSearch,
        cleanSearch,
        resourceOptions,
        selectedElement,
        setSelectedElement,
        selectedMode,
        setSelectedMode,
        handleAdd,
        loading
    };
}
