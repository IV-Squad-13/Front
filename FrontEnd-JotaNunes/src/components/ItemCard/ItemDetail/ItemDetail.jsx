import Collapsible from "@/components/collapsible/Collapsible";
import { getCatalogResourceById, getCatalogByResourceInPadrao } from "@/services/CatalogService";
import { useEffect, useState } from "react";
import styles from './ItemDetail.module.css'

const ItemDetail = ({ resourceType, id, handleAssociatedResourceClick }) => {
    const [resource, setResource] = useState(null);
    const [selectedPadraoId, setSelectedPadraoId] = useState(null);

    const associationByType = {
        ambiente: ["itemSet", "padraoSet"],
        item: ["ambienteSet", "padraoSet"],
        material: ["marcaSet", "padraoSet"],
        marca: ["materialSet", "padraoSet"],
        padrao: ["ambienteSet", "itemSet", "materialSet", "marcaSet"]
    };

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            const data = await getCatalogResourceById(resourceType, id, { loadAll: true });
            if (mounted) setResource(data);
        };

        load();
        setSelectedPadraoId(null);
        return () => (mounted = false);
    }, [resourceType, id]);

    useEffect(() => {
        if (!selectedPadraoId) return;

        const loadFiltered = async () => {
            const assocKey = `${resourceType}Set`;
            const filteredData = await getCatalogByResourceInPadrao(selectedPadraoId, resourceType, id);

            console.log("Filtered Data:", filteredData);
            setResource(prev => ({
                ...prev,
                [assocKey]: filteredData
                    .map(entry => entry[resourceType])
                    .filter(Boolean)
            }));
        };

        loadFiltered();
    }, [selectedPadraoId, resourceType, id]);

    const handlePadraoView = (padraoId) => {
        setSelectedPadraoId(padraoId);
    };

    if (!resource) return <p>Carregando...</p>;

    return (
        <div className={styles.container}>
            <h1>{resource.name}</h1>

            {(resource.desc || resource.local) && (
                <Collapsible title="Detalhes Gerais">
                    {resource.desc && <p><strong>Descrição:</strong> {resource.desc}</p>}
                    {resource.local && <p><strong>Localização:</strong> {resource.local}</p>}
                </Collapsible>
            )}

            <div>
                <div>{Array.from(associationByType).map(([key, value]) => (
                    <div key={key}>
                        <strong>{key}:</strong> {value.join(", ")}
                    </div>
                ))}</div>
            </div>

            {associationByType[resourceType]?.map((assocKey) => {
                const associatedList = resource[assocKey] ?? [];
                if (associatedList.length === 0) return null;

                const assocType = assocKey.replace("Set", "");

                return (
                    <Collapsible key={assocKey} title={`Associações: ${assocType}`}>
                        {associatedList.map((associatedItem) => (
                            <div key={associatedItem.id} style={{ marginBottom: "8px" }}>
                                <p
                                    style={{ cursor: "pointer", color: "blue" }}
                                    onClick={() => handleAssociatedResourceClick({
                                        ...associatedItem,
                                        resourceType: assocType
                                    })}
                                >
                                    {associatedItem.name}
                                </p>

                                {associatedItem.desc && (
                                    <p><strong>Descrição:</strong> {associatedItem.desc}</p>
                                )}

                                {assocType === "padrao" && (
                                    <p
                                        onClick={() => handlePadraoView(associatedItem.id)}
                                        style={{ cursor: "pointer", color: selectedPadraoId === associatedItem.id ? "red" : "purple" }}
                                    >
                                        <strong>Filtrar por este padrão</strong>
                                    </p>
                                )}
                            </div>
                        ))}
                    </Collapsible>
                );
            })}
        </div>
    );
};

export default ItemDetail;