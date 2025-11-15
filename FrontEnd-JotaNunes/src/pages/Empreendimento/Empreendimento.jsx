import React, { useEffect, useState } from "react";
import EmpreendimentoForm from "@/components/forms/EmpreendimentoForm/EmpreendimentoForm";
import EspecificacaoForm from "@/components/forms/EspecificacaoForm/EspecificacaoForm";
import { getEmpreendimentoById, startProcess } from "@/services/SpecificationService";
import styles from "./Empreendimento.module.css";
import { useParams } from "react-router-dom";

const Empreendimento = () => {
    const { id } = useParams();
    const [empreendimento, setEmpreendimento] = useState(null);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    const [currentStep, setCurrentStep] = useState(0);

    const stepStore = {
        0: [
            EmpreendimentoForm,
            'Bem vindo ao cadastro de Empreendimentos!',
            () => loadEspecificacao()
        ],
        1: [
            EspecificacaoForm,
            'Insira aqui os dados da nova Especificação',
            () => loadAmbientes()
        ],
    };

    const StepComponent = stepStore[currentStep][0];
    const totalSteps = Object.keys(stepStore).length - 1;

    useEffect(() => {
        loadEmpreendimento();
    }, []);

    const loadEmpreendimento = async () => {
        setLoading(true);
        try {
            const emp = await getEmpreendimentoById(id);
            setEmpreendimento(emp);
        } catch (error) {
            console.error("Erro ao buscar empreendimento:", error);
            alert("Erro ao buscar empreendimento");
        } finally {
            setLoading(false);
        }
    };

    const voltar = () => currentStep > 0 && setCurrentStep(currentStep - 1);

    const handleAvancar = async () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            await startProcess();
        }
    };

    const handleFinish = () => {
        console.log("Processo finalizado!");
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleArea}>
                    <h1 className={styles.title}>Cadastro de Especificações</h1>
                    <p className={styles.subtitle}>
                        {stepStore[currentStep][1] || "Carregando..."}
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
                    disabled={currentStep === 0}
                    className={styles.button}
                >
                    Voltar
                </button>
                {currentStep < totalSteps ? (
                    <button onClick={handleAvancar} className={styles.button}>
                        Avançar
                    </button>
                ) : (
                    <button className={styles.button} onClick={handleFinish}>
                        Finalizar
                    </button>
                )}
            </div>
        </div>
    );
};

export default Empreendimento;