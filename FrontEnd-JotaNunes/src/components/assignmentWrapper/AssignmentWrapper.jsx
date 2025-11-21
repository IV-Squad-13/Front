import { useState } from "react";
import SideEditor from "../sideEditor/SideEditor";
import styles from "./AssignmentWrapper.module.css";

import GroupedAssignmentTable from "../groupedAssignmentTable/GroupedAssignmentTable";
import SimpleAssignmentTable from "../simpleAssignmentTable/SimpleAssignmentTable";

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
        if (currentElement === ELEMENTS.AMBIENTE) {
            setCurrentElement(null);
        }

        setParent(null);
        setCurrentElement(ELEMENTS.AMBIENTE);
    };

    const handleAddItem = (selectedParent) => {
        if (!selectedParent) return;

        if (currentElement === ELEMENTS.ITEM) {
            setCurrentElement(null);
        }

        setParent(selectedParent);
        setCurrentElement(ELEMENTS.ITEM);
    };

    return (
        <div className={styles.wrapper}>
            {parentList && (
                <div className={styles.docData}>
                    {parentList.type === "ambiente" ? (
                        <GroupedAssignmentTable
                            groups={parentList.data}
                            setEmp={setEmp}
                            addParent={handleAddAmbiente}
                            addChildren={handleAddItem}
                        />
                    ) : (
                        <SimpleAssignmentTable
                            setEmp={setEmp}
                            data={parentList.data}
                        />
                    )}
                </div>
            )}

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