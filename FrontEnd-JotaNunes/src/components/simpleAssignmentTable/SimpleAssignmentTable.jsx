import React, { useState } from "react";
import styles from "./SimpleAssignmentTable.module.css";
import { updateDocElement, deleteDocElement } from "@/services/SpecificationService";
import { updateElementInDoc } from "@/lib/deepUpdateHelper";
import BaseTable from "../baseTable/BaseTable";
import Button from "../button/Button";

const SimpleAssignmentTable = ({ data = [], setEmp, addMaterial, addMarca }) => {
    const columns = [
        { key: "material", label: "Material", type: "tuple" },
        { key: "marcas", label: "Marcas", type: "commaList" }
    ];

    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const handleEdit = async (row, key, payload) => {
        if (key === "material") {
            const tuple = row.material?.nome ?? ["name", ""];
            const fieldKey = tuple[0];
            const newValue = payload;
            try {
                const updated = await updateDocElement(row.material.id_, { [fieldKey]: newValue, docType: "MATERIAL" });
                setEmp(prev => ({
                    ...prev,
                    doc: updateElementInDoc(prev.doc, {
                        docType_: "material",
                        id_: row.material.id_,
                    }, { fieldKey: updated[fieldKey] })
                }));
            } catch (err) {
                console.error("Failed to update material:", err);
            }
        }

        if (key === "marcas") {
            if (payload.action === "rename") {
                try {
                    const updated = await updateDocElement(payload.id, { name: payload.name, docType: "MARCA" });
                    setEmp(prev => ({
                        ...prev,
                        doc: updateElementInDoc(prev.doc, {
                            docType_: "marca",
                            id_: payload.id,
                            materialId_: row.material.id_
                        }, { name: updated.name })
                    }));
                } catch (err) {
                    console.error("Failed to rename marca:", err);
                }
            } else if (payload.action === "delete") {
                try {
                    await deleteDocElement(payload.id, "MARCA");
                    setEmp(prev => ({
                        ...prev,
                        doc: updateElementInDoc(prev.doc, {
                            docType_: "marca",
                            id_: payload.id,
                            materialId_: row.material.id_
                        }, null, true)
                    }));
                } catch (err) {
                    console.error("Failed to delete marca:", err);
                }
            }
        }
    };

    const handleDeleteRow = async (row) => {
        const materialId = row.material?.id_;
        if (!materialId) return;
        try {
            await deleteDocElement(materialId, "MATERIAL");
            setEmp(prev => ({
                ...prev,
                doc: updateElementInDoc(prev.doc, {
                    docType_: "material",
                    id_: materialId
                }, null, true)
            }));
        } catch (err) {
            console.error("Failed to delete material:", err);
        }
    };

    const handleMaterialSelect = (row) => {
        if (selectedMaterial?.id !== undefined && (row.material?.id_ === selectedMaterial?.id_)) 
            return setSelectedMaterial(null);
        
        return setSelectedMaterial(row.material);
    }

    return (
        <div>
            <div className={styles.actions}>
                <Button type="button" onClick={() => addMaterial && addMaterial()} variant="header">
                    Adicionar Material
                </Button>
                <Button disabled={selectedMaterial === null} type="button" onClick={() => addMarca(selectedMaterial)} variant="header">
                    Adicionar Marca
                </Button>
            </div>
            <BaseTable
                columns={columns}
                data={data}
                onEdit={handleEdit}
                onDelete={handleDeleteRow}
                selectRow={handleMaterialSelect}
            />
        </div>
    );
}

export default SimpleAssignmentTable;