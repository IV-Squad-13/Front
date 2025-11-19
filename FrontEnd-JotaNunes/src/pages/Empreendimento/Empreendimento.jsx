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

    const handleGroupedAssignment = () => {
        return true;
    };

    const stepStore = useMemo(
        () => ({
            0: {
                component: EmpreendimentoForm,
                title: "Bem vindo ao cadastro de Empreendimentos!",
                action: handleEmpSubmit
            },
            1: {
                component: EspecificacaoForm,
                title: "Insira aqui os dados da nova Especificação",
                action: handleSpecSubmit
            },
            2: {
                component: GroupedAssigner,
                title: `${empreendimento.name} - Unidades privativas`,
                local: "UNIDADES_PRIVATIVAS",
                action: handleGroupedAssignment
            },
            3: {
                component: GroupedAssigner,
                title: `${empreendimento.name} - Área comum`,
                local: "AREA_COMUM",
                action: handleGroupedAssignment
            }
        }),
        [empreendimento, empId]
    );

    const { component: StepComponent, title, action } = stepStore[currentStep];
    const totalSteps = Object.keys(stepStore).length - 1;

    const groupedAssignment = useMemo(() => {
        const localKey = stepStore[currentStep]?.local;
        if (!localKey) return [];

        const doc = empreendimento.doc;
        if (!doc?.locais) return  [];

        const local = doc.locais.find(l => l.local === localKey);
        if (!local) return [];

        const ambientes = local.ambientes ?? [];

        return ambientes.map(a => ({
            id_: a.id,
            docType_: "ambiente",
            localId_: local.id,
            name: a.name ?? "Ambiente sem nome",
            children: a.items.map((item) => {
                return {
                    id_: item.id,
                    docType_: "item",
                    localId_: local.id,
                    ambienteId_: a.id,
                    nome: ['name', item.name],
                    tipo: ['type', item.type],
                    desc: ['desc', item.desc]
                }
            })
        }));
    }, [empreendimento, currentStep, stepStore]);

    const voltar = () => {
        if (currentStep === 0) {
            navigate("/home/consulta-empreendimentos");
        } else {
            setCurrentStep(s => s - 1);
        }
    };

    const avancar = async () => {
        const ok = await action();
        if (!ok) return;

        if (currentStep < totalSteps) {
            setCurrentStep(s => s + 1);
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
                    setEmp={setEmpreendimento}
                    parentList={groupedAssignment}
                />
            </main>

            <footer className={styles.buttonsArea}>
                <button onClick={voltar} className={styles.button}>Voltar</button>

                {currentStep < totalSteps ? (
                    <button onClick={avancar} className={styles.button}>Avançar</button>
                ) : (
                    <button onClick={finalizar} className={styles.button}>Finalizar</button>
                )}
            </footer>
        </div>
    );
};

export default Empreendimento;