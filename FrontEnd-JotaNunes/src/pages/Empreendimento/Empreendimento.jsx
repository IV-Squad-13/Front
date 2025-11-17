import React, { useEffect, useState, useMemo } from "react";
import EmpreendimentoForm from "@/components/forms/EmpreendimentoForm/EmpreendimentoForm";
import EspecificacaoForm from "@/components/forms/EspecificacaoForm/EspecificacaoForm";
import {
    getEmpreendimentoById,
    startProcess,
    updateEmpreendimento
} from "@/services/SpecificationService";

import styles from "./Empreendimento.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Empreendimento = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [empreendimento, setEmpreendimento] = useState({ name: "", init: "", creatorId: user.id });
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [empId, setEmpId] = useState(id || null);

    const handleEmpSubmit = async () => {
        try {
            if (!empId) {
                console.log(empreendimento);
                const created = await startProcess(empreendimento);
                setEmpId(created.id);
            } else {
                await updateEmpreendimento(empId, empreendimento);
            }
        } catch (error) {
            console.error("Erro ao salvar empreendimento", error);
        }
    };

    const handleSpecSubmit = async (name, desc) => {
    };

    const stepStore = useMemo(
        () => ({
            0: [
                EmpreendimentoForm,
                "Bem vindo ao cadastro de Empreendimentos!",
                handleEmpSubmit
            ],
            1: [
                EspecificacaoForm,
                "Insira aqui os dados da nova Especificação",
                handleSpecSubmit
            ]
        }),
        [empreendimento, handleEmpSubmit]
    );

    const StepComponent = stepStore[currentStep][0];
    const totalSteps = Object.keys(stepStore).length - 1;

    useEffect(() => {
        if (id) {
            loadEmpreendimento(id);
        }
    }, [id]);

    const loadEmpreendimento = async () => {
        setLoading(true);
        try {
            const emp = await getEmpreendimentoById(id);

            if (!emp) throw new Error("Not found");

            setEmpreendimento({
                ...emp,
                name: emp.name || "",
                init: emp.init || "",
            });

            setEmpId(emp.id);
        } catch (error) {
            console.error("Nenhum Empreendimento encontrado", error);
        } finally {
            setLoading(false);
        }
    };

    const voltar = () => {
        if (currentStep === 0) {
            return navigate(`/home/consulta-empreendimentos`);
        }
        setCurrentStep((s) => s - 1);
    };

    const handleAvancar = async () => {
        const submitFn = stepStore[currentStep][2];
        await submitFn();

        if (currentStep < totalSteps) {
            setCurrentStep((s) => s + 1);
        }
    };

    const handleFinish = () => {
        console.log("Processo finalizado!");
    };

    if (loading) return <div className={styles.container}>Carregando...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleArea}>
                    <h1 className={styles.title}>Cadastro de Especificações</h1>
                    <p className={styles.subtitle}>
                        {stepStore[currentStep][1]}
                    </p>
                </div>
            </div>

            <div className={styles.mainArea}>
                <StepComponent emp={empreendimento} setEmp={setEmpreendimento} />
            </div>

            <div className={styles.buttonsArea}>
                <button onClick={voltar} className={styles.button}>
                    Voltar
                </button>

                {currentStep < totalSteps ? (
                    <button onClick={handleAvancar} className={styles.button}>
                        Avançar
                    </button>
                ) : (
                    <button onClick={handleFinish} className={styles.button}>
                        Finalizar
                    </button>
                )}
            </div>
        </div>
    );
};

export default Empreendimento;