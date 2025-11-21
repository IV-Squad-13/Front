import Collapsible from "@/components/collapsible/Collapsible";
import AssignmentTable from "@/components/assignmentTable/AssignmentTable";
import styles from "./GroupedAssigner.module.css";
import ParentHeader from "./ParentHeader/ParentHeader";
import { updateDocElement, deleteDocElement } from "@/services/SpecificationService";
import { updateElementInDoc } from "@/lib/deepUpdateHelper";
import Button from "../button/Button";

const GroupedAssigner = ({ setEmp, parentList = [], addAmbiente, addChildren }) => {

    const handleEditParent = async (parent, newName) => {
        try {
            const updatedDocElement = await updateDocElement(parent.id_, {
                name: newName,
                docType: "AMBIENTE"
            });

            setEmp(prev => ({
                ...prev,
                doc: updateElementInDoc(prev.doc, parent, updatedDocElement)
            }));
        } catch (err) {
            console.error("Failed to update parent:", err);
        }
    };

    const handleDeleteParent = async (parent) => {
        try {
            await deleteDocElement(parent.id_, "AMBIENTE");

            setEmp(prev => ({
                ...prev,
                doc: updateElementInDoc(prev.doc, parent, null, true)
            }));
        } catch (err) {
            console.error("Failed to delete parent:", err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.actions}>
                <Button
                    type="button"
                    onClick={() => addAmbiente()}
                    variant="header"
                >
                    Adicionar Ambiente
                </Button>
            </div>

            {parentList.map(parent => {
                const children = parent.children ?? [];
                const detectedColumns =
                    children.length > 0 ? Object.keys(children[0]) : [];

                return (
                    <Collapsible
                        key={parent.id_}
                        title={
                            <ParentHeader
                                parent={parent}
                                onEditParent={(value) =>
                                    handleEditParent(parent, value)
                                }
                                onDeleteParent={() =>
                                    handleDeleteParent(parent)
                                }
                            />
                        }
                    >
                        <>
                            <div className={styles.actions}>
                                <Button
                                    type="button"
                                    onClick={() => addChildren(parent)}
                                    variant="header"
                                >
                                    Adicionar Item
                                </Button>
                            </div>
                            {children?.length > 0 && (
                                <div className={styles.tableWrapper}>
                                    <AssignmentTable
                                        setEmp={setEmp}
                                        columns={detectedColumns}
                                        data={children}
                                    />
                                </div>
                            )}
                        </>
                    </Collapsible>
                );
            })}
        </div>
    );
};

export default GroupedAssigner;