import { useState } from "react";
import AssignmentTable from "../assignmentTable/AssignmentTable";
import GroupedAssigner from "../groupedAssigner/GroupedAssigner";
import SideEditor from "../sideEditor/SideEditor";
import styles from "./AssignmentWrapper.module.css";

const ELEMENTS = {
    AMBIENTE: "AMBIENTE",
    ITEM: "ITEM",
    MATERIAL: "MATERIAL",
    MARCA: "MARCA",
};

const AssignmentWrapper = ({ specId, setEmp, parentList, local }) => {
    const [parent, setParent] = useState(null);
    const [currentElement, setCurrentElement] = useState(null);

    const handleAddAmbiente = () => {
        if (currentElement === ELEMENTS.AMBIENTE) setCurrentElement(null);

        setParent(null);
        setCurrentElement(ELEMENTS.AMBIENTE);
    };

    const handleAddItem = (selectedParent) => {
        if (currentElement === ELEMENTS.ITEM) setCurrentElement(null);
        if (!selectedParent) return;

        setParent(selectedParent);
        setCurrentElement(ELEMENTS.ITEM);
    };

    return (
        <div className={styles.wrapper}>
            {Array.isArray(parentList) && (<div className={styles.docData}>
                {parentList !== undefined ? (
                    <GroupedAssigner
                        setEmp={setEmp}
                        parentList={parentList}
                        addAmbiente={handleAddAmbiente}
                        addChildren={handleAddItem}
                    />
                ) : (
                    <AssignmentTable />
                )}
            </div>)}

            {currentElement && (
                <div className={styles.sideEditor}>
                    <SideEditor
                        specId={specId}
                        setEmp={setEmp}
                        parent={parent}
                        local={local}
                        elementToAdd={currentElement.toLowerCase()}
                    />
                </div>

            )}
        </div>
    );
};

export default AssignmentWrapper;