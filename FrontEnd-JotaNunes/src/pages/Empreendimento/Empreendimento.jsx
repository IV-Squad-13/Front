import React, { useEffect, useState, useMemo } from "react";
import EmpreendimentoForm from "@/components/forms/EmpreendimentoForm/EmpreendimentoForm";
import EspecificacaoForm from "@/components/forms/EspecificacaoForm/EspecificacaoForm";
import { getEmpreendimentoById, startProcess } from "@/services/SpecificationService";
import styles from "./Empreendimento.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Empreendimento = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [empreendimento, setEmpreendimento] = useState(null);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    const [currentStep, setCurrentStep] = useState(0);

    const stepStore = useMemo(() => ({
        0: [EmpreendimentoForm, "Bem vindo ao cadastro de Empreendimentos!"],
        1: [EspecificacaoForm, "Insira aqui os dados da nova Especificação"],
    }), []);

    const StepComponent = stepStore[currentStep][0];
    const totalSteps = Object.keys(stepStore).length - 1;

    useEffect(() => {
        if (id) {
            loadEmpreendimento();
        } else {
            resetForm();
        }
    }, [id]);

    const resetForm = () => {
        setEmpreendimento(null);
        setTitle("");
        setName("");
        setDesc("");
        setCurrentStep(0);
    };

    const loadEmpreendimento = async () => {
        setLoading(true);
        try {
            const emp = await getEmpreendimentoById(id);

            if (!emp) throw new Error("Not found");

            setEmpreendimento(emp);
            setTitle(emp?.title || "");
            setName(emp?.name || "");
            setDesc(emp?.desc || "");
        } catch (error) {
            console.error("Nenhum Empreendimento encontrado", error);
            resetForm();
        } finally {
            setLoading(false);
        }
    };

    const voltar = () => {
        if (currentStep === 0) {
            return navigate(`/home/consulta-empreendimentos`);
        }

        if (currentStep > 0) setCurrentStep((s) => s - 1);
    };

    const handleAvancar = async () => {
        if (currentStep < totalSteps) {
            setCurrentStep((s) => s + 1);
        } else {
            await startProcess();
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
                <StepComponent
                    title={title}
                    onChange={(e) => setTitle(e.target.value)}
                    name={name}
                    onNameChange={(e) => setName(e.target.value)}
                    desc={desc}
                    onDescChange={(e) => setDesc(e.target.value)}
                />
            </div>

            <div className={styles.buttonsArea}>
                <button
                    onClick={voltar}
                    className={styles.button}
                >
                    Voltar
                </button>

                {currentStep < totalSteps ? (
                    <button
                        onClick={handleAvancar}
                        className={styles.button}
                    >
                        Avançar
                    </button>
                ) : (
                    <button
                        className={styles.button}
                        onClick={handleFinish}
                    >
                        Finalizar
                    </button>
                )}
            </div>
        </div>
    );
};

export default Empreendimento;