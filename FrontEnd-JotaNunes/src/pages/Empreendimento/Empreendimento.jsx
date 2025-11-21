import React, { useEffect, useState, useMemo } from "react";
import EmpreendimentoForm from "@/components/forms/EmpreendimentoForm/EmpreendimentoForm";
import EspecificacaoForm from "@/components/forms/EspecificacaoForm/EspecificacaoForm";
import GroupedAssigner from "@/components/groupedAssigner/GroupedAssigner";

import {
    getEmpreendimentoById,
    startProcess,
    updateEmpreendimento,
    updateSpecification
} from "@/services/SpecificationService";

import styles from "./Empreendimento.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AssignmentTable from "@/components/assignmentTable/AssignmentTable";
import AssignmentWrapper from "@/components/assignmentWrapper/AssignmentWrapper";

const INITIAL_DOC = { name: "", desc: "" };

const docLoadParams = {
    loadLocais: true,
    loadAmbientes: true,
    loadItems: true,
    loadMateriais: true,
    loadMarcas: true
};

const Empreendimento = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [empreendimento, setEmpreendimento] = useState({
        name: "",
        init: "",
        creatorId: user.id,
        doc: INITIAL_DOC
    });

    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [currentSection, setCurrentSection] = useState("start");
    const [empId, setEmpId] = useState(id || null);

    const loadEmpreendimento = async () => {
        setLoading(true);
        try {
            const data = await getEmpreendimentoById(id, docLoadParams);
            if (!data) throw new Error("Not found");

            setEmpreendimento({
                ...data,
                name: data.name ?? "",
                init: data.init ?? "",
                doc: data.doc ?? INITIAL_DOC
            });

            setEmpId(data.id);
        } catch (error) {
            console.error("Nenhum Empreendimento encontrado", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) loadEmpreendimento();
    }, [id]);

    const handleEmpSubmit = async () => {
        try {
            if (!empId) {
                const created = await startProcess(empreendimento);
                setEmpId(created.id);
                setEmpreendimento(created);
            } else {
                const updated = await updateEmpreendimento(empId, empreendimento, docLoadParams);
                setEmpreendimento(updated);
            }
            return true;
        } catch (err) {
            console.error("Erro ao salvar empreendimento", err);
            return false;
        }
    };

    const handleSpecSubmit = async () => {
        try {
            const updatedDoc = await updateSpecification(
                empreendimento.doc,
                empreendimento.doc.id
            );

            setEmpreendimento({
                ...empreendimento,
                doc: {
                    ...empreendimento.doc,
                    name: updatedDoc.name,
                    desc: updatedDoc.desc
                }
            });

            return true;
        } catch (err) {
            console.error("Erro ao salvar especificação", err);
            return false;
        }
    };

    const handleGroupedAssignment = () => true;

    const stepStore = useMemo(
        () => ({
            0: {
                component: EmpreendimentoForm,
                title: "Bem vindo ao cadastro de Empreendimentos!",
                action: handleEmpSubmit,
                section: "start"
            },
            1: {
                component: EspecificacaoForm,
                title: "Insira aqui os dados da nova Especificação",
                action: handleSpecSubmit,
                section: "start"
            },
            2: {
                component: AssignmentWrapper,
                title: `${empreendimento.name} - Unidades privativas`,
                local: "UNIDADES_PRIVATIVAS",
                action: handleGroupedAssignment,
                section: "ambientes"
            },
            3: {
                component: AssignmentWrapper,
                title: `${empreendimento.name} - Área comum`,
                local: "AREA_COMUM",
                action: handleGroupedAssignment,
                section: "ambientes"
            },
            4: {
                component: AssignmentWrapper,
                title: `${empreendimento.name} - Marcas e materiais`,
                action: handleGroupedAssignment,
                section: "materiais"
            }
        }),
        [empreendimento, empId]
    );

    const { component: StepComponent, title, action } = stepStore[currentStep];
    const totalSteps = Object.keys(stepStore).length - 1;

    const groupedAssignment = useMemo(() => {
        const doc = empreendimento.doc;
        if (!doc) return { ambientes: [], materiais: [] };

        const locais = doc.locais ?? [];
        const materiais = doc.materiais ?? [];

        const ambientesGroup = [];
        locais.forEach(local => {
            (local.ambientes ?? []).forEach(a => {
                ambientesGroup.push({
                    id_: a.id,
                    docType_: "ambiente",
                    localId_: local.id,
                    local_: a.local,
                    name: a.name,
                    children: a.items.map(item => ({
                        id_: item.id,
                        docType_: "item",
                        localId_: local.id,
                        ambienteId_: a.id,
                        nome: ["name", item.name],
                        tipo: ["type", item.type],
                        desc: ["desc", item.desc]
                    }))
                });
            });
        });

        const materiaisGroup = materiais.map(m => ({
            id_: m.id,
            docType_: "material",
            nome: ["name", m.name],
            children: m.marcas.map(marca => ({
                id_: marca.id,
                docType_: "marca",
                materialId_: m.id,
                nome: ["name", marca.name]
            }))
        }));

        return {
            ambientes: ambientesGroup,
            materiais: materiaisGroup
        };
    }, [empreendimento]);

    const parentList = useMemo(() => {
        const group = groupedAssignment[currentSection];

        if (!group) return [];

        const stepCfg = stepStore[currentStep];

        if (currentSection === "ambientes") {
            const localKey = stepCfg.local;
            if (!localKey) return [];
            return group.filter(amb => amb.local_ === localKey);
        }

        return group;
    }, [groupedAssignment, currentSection, stepStore, currentStep]);

    const voltar = () => {
        if (currentStep === 0) {
            navigate("/home/consulta-empreendimentos");
            return;
        }
        const prev = currentStep - 1;
        setCurrentStep(prev);
        setCurrentSection(stepStore[prev].section);
    };

    const avancar = async () => {
        const ok = await action();
        if (!ok) return;

        if (currentStep < totalSteps) {
            const next = currentStep + 1;
            setCurrentStep(next);
            setCurrentSection(stepStore[next].section);
        }
    };

    const finalizar = () => {
        console.log("Processo finalizado!");
    };

    if (loading) return <div className={styles.container}>Carregando...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.headerContainer}>
                <div className={styles.titleArea}>
                    <h1 className={styles.title}>Cadastro de Especificações</h1>
                    <p className={styles.subtitle}>{title}</p>
                </div>
            </header>

            <main className={styles.mainArea}>
                <StepComponent
                    emp={empreendimento}
                    specId={empreendimento.doc?.id}
                    setEmp={setEmpreendimento}
                    parentList={parentList}
                    local={stepStore[currentStep]?.local ?? null}
                />
            </main>

            <footer className={styles.buttonsArea}>
                <button onClick={voltar} className={styles.button}>
                    Voltar
                </button>

                {currentStep < totalSteps ? (
                    <button onClick={avancar} className={styles.button}>
                        Avançar
                    </button>
                ) : (
                    <button onClick={finalizar} className={styles.button}>
                        Finalizar
                    </button>
                )}
            </footer>
        </div>
    );
};

export default Empreendimento;