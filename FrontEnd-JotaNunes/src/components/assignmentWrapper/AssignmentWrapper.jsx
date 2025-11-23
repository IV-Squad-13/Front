import React, { useState } from "react";
import SideEditor from "@/components/sideEditor/SideEditor";
import styles from "./AssignmentWrapper.module.css";

import GroupedAssignmentTable from "@/components/groupedAssignmentTable/GroupedAssignmentTable";
import SimpleAssignmentTable from "@/components/simpleAssignmentTable/SimpleAssignmentTable";

const ELEMENTS = {
    AMBIENTE: "ambiente",
    ITEM: "item",
    MATERIAL: "material",
    MARCA: "marca",
};

const AssignmentWrapper = ({ specId, setEmp, parentList, local }) => {
    const [parent, setParent] = useState(null);
    const [currentElement, setCurrentElement] = useState(null);

    const toggle = (element, selectedParent = null) => {
        if (currentElement === element) {
            setCurrentElement(null);
            setParent(null);
            return;
        }

        setCurrentElement(element);
        setParent(selectedParent ?? null);
    };

    return (
        <div className={styles.wrapper}>
            {parentList && (
                <div className={styles.docData}>
                    {parentList.type === "ambiente" ? (
                        <GroupedAssignmentTable
                            groups={parentList.data}
                            setEmp={setEmp}
                            addParent={() => toggle(ELEMENTS.AMBIENTE)}
                            addChildren={selected => toggle(ELEMENTS.ITEM, selected)}
                        />
                    ) : (
                        <SimpleAssignmentTable
                            setEmp={setEmp}
                            data={parentList.data}
                            addMaterial={() => toggle(ELEMENTS.MATERIAL)}
                            addMarca={selected => toggle(ELEMENTS.MARCA, selected)}
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
                        elementToAdd={currentElement}
                    />
                </div>
            )}
        </div>
    );
};

export default AssignmentWrapper;