import React from "react";
import { updateDocElement, deleteDocElement } from "@/services/SpecificationService";
import { updateElementInDoc } from "@/lib/deepUpdateHelper";
import Button from "../button/Button";
import Collapsible from "../collapsible/Collapsible";
import ParentHeader from "./ParentHeader/ParentHeader";
import BaseTable from "../baseTable/BaseTable";
import styles from "./GroupedAssignmentTable.module.css"

const GroupedAssignmentTable = ({ groups = [], setEmp, addChildren, addParent }) => {
    const handleEditParent = async (parent, newName) => {
        try {
            const updated = await updateDocElement(parent.id_, { name: newName, docType: "AMBIENTE" });
            setEmp(prev => ({ ...prev, doc: updateElementInDoc(prev.doc, parent, { name: updated.name }) }));
        } catch (err) {
            console.error("Failed to update parent:", err);
        }
    };

    const handleDeleteParent = async (parent) => {
        try {
            await deleteDocElement(parent.id_, "AMBIENTE");
            setEmp(prev => ({ ...prev, doc: updateElementInDoc(prev.doc, parent, null, true) }));
        } catch (err) {
            console.error("Failed to delete parent:", err);
        }
    };

    const handleEditChild = async (row, colKey, newValue, extra) => {
        const tuple = row[colKey] ?? [colKey, ""];
        const fieldKey = tuple[0];
        try {
            const updated = await updateDocElement(row.id_, { [fieldKey]: newValue, docType: "ITEM" });
            setEmp(prev => ({ ...prev, doc: updateElementInDoc(prev.doc, row, { fieldKey: updated[fieldKey] }) }));
        } catch (err) {
            console.error("Failed to update child:", err);
        }
    };

    const handleDeleteChild = async (row) => {
        try {
            await deleteDocElement(row.id_, "ITEM");
            setEmp(prev => ({ ...prev, doc: updateElementInDoc(prev.doc, row, null, true) }));
        } catch (err) {
            console.error("Failed to delete child:", err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.actions}>
                <Button type="button" onClick={() => addParent && addParent()} variant="primary contained">
                    Adicionar Ambiente
                </Button>
            </div>

            {groups.map(parent => {
                const children = parent.children ?? [];
                const detected = children.length > 0 ? Object.keys(children[0]) : [];
                const columns = detected.map(k => {
                    return { key: k, label: k.charAt(0).toUpperCase() + k.slice(1), type: "tuple" };
                });

                return (
                    <Collapsible
                        className={styles.headerCollapsible}
                        key={parent.id_}
                        titleStyle={styles.titleContainer}
                        title={<ParentHeader parent={parent} onEditParent={(v) => handleEditParent(parent, v)} onDeleteParent={() => handleDeleteParent(parent)} />}
                    >
                        <>
                            <div className={styles.actions}>
                                <Button type="button" onClick={() => addChildren(parent)} variant="outline contained">
                                    Adicionar Item
                                </Button>
                            </div>

                            {children.length > 0 && (
                                <div className={styles.tableWrapper}>
                                    <BaseTable
                                        columns={columns}
                                        data={children}
                                        onEdit={handleEditChild}
                                        onDelete={handleDeleteChild}
                                    />
                                </div>
                            )}
                        </>
                    </Collapsible>
                );
            })}
        </div>
    );
}

export default GroupedAssignmentTable;