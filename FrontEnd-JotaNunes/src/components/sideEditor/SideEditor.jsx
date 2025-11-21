import React from "react";
import styles from "./SideEditor.module.css";
import Button from "../button/Button";
import { useSideEditor } from "@/hooks/useSideEditor";
import SearchResultsPanel from "./components/SearchResultsPanel/SearchResultsPanel";
import FieldSearchPanel from "./components/FieldSearchPanel/FieldSearchPanel";
import ConstraintPanel from "./components/ConstraintPanel/ConstraintPanel";

export default function SideEditor(props) {
    const {
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
    } = useSideEditor(props);

    const { elementToAdd, parent } = props;

    return (
        <div className={styles.sideEditorContainer}>
            <div className={styles.header}>
                <p>
                    Adicionar {elementToAdd} {parent ? `em ${parent.name}` : ""}
                </p>
                <button className={styles.addButton} onClick={handleAdd} disabled={loading}>
                    {loading ? "Adicionando..." : "Adicionar"}
                </button>
            </div>

            <div className={styles.tabContainer}>
                {TABS.map(t => (
                    <div
                        key={t.name}
                        className={`${styles.tab} ${currentTab === t.name ? styles.activeTab : ""}`}
                        onClick={() => setCurrentTab(t.name)}
                    >
                        {t.label}
                    </div>
                ))}
            </div>

            <div className={styles.body}>
                <ConstraintPanel
                    constraints={constraints}
                    onSearch={handleConstraintSearch}
                    onSelect={handleConstraintSelect}
                />

                <FieldSearchPanel
                    fields={fields}
                    onFieldTyping={handleFieldTyping}
                />

                <div className={styles.searchButtons}>
                    <Button type="button" onClick={submitSearch} variant="header">Enviar</Button>
                    <Button type="button" onClick={cleanSearch} variant="header">Limpar</Button>
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.dropDownContainer}>
                    <SearchResultsPanel
                        mode={selectedMode}
                        setMode={setSelectedMode}
                        options={resourceOptions}
                        selected={selectedElement}
                        setSelected={setSelectedElement}
                    />
                </div>
            </div>
        </div>
    );
}
