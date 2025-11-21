import React from "react";
import styles from "./SimpleAssignmentTable.module.css";
import { updateDocElement, deleteDocElement } from "@/services/SpecificationService";
import { updateElementInDoc } from "@/lib/deepUpdateHelper";
import BaseTable from "../baseTable/BaseTable";

const SimpleAssignmentTable = ({ data = [], setEmp }) => {
    const columns = [
        { key: "material", label: "Material", type: "tuple" },
        { key: "marcas", label: "Marcas", type: "commaList" }
    ];

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
                    }, updated)
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
                        }, updated)
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

    return (
        <BaseTable
            columns={columns}
            data={data}
            onEdit={handleEdit}
            onDelete={handleDeleteRow}
        />
    );
}

export default SimpleAssignmentTable;