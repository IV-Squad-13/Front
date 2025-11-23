import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useEmpreendimento from "@/hooks/useEmpreendimento";
import useGroupedAssignment from "@/hooks/useGroupedAssignment";
import useSteps from "@/hooks/useSteps";
import styles from "./Empreendimento.module.css";

const Empreendimento = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { empreendimento, setEmpreendimento, loading, saveEmp, saveSpec } = useEmpreendimento(id, user);
    const { groupedAssignment, filterByLocal } = useGroupedAssignment(empreendimento.doc);
    const steps = useSteps({ empreendimento, saveEmp, saveSpec });

    const [current, setCurrent] = useState(0);
    const total = steps.length - 1;

    const stepCfg = steps[current];
    const StepComponent = stepCfg.Component;

    const parentList = filterByLocal(stepCfg.section, stepCfg.local);

    const voltar = () => {
        if (current === 0) {
            navigate("/home/empreendimentos");
            return;
        }
        setCurrent(s => s - 1);
    };

    const avancar = async () => {
        const result = await stepCfg.onSubmit();
        if (!result || !result.ok) return;

        if (current < total) setCurrent(s => s + 1);
    };

    const finalizar = () => {
        navigate(id ? `/home/resumo/${encodeURIComponent(id)}` : `/home/resumo`);
        return;
    };

    if (loading) return <div className={styles.container}>Carregando...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.headerContainer}>
                <div className={styles.titleArea}>
                    <h1 className={styles.title}>Cadastro de Especificações</h1>
                    <p className={styles.subtitle}>{stepCfg.title}</p>
                </div>
            </header>

            <main className={styles.mainArea}>
                <StepComponent
                    emp={empreendimento}
                    specId={empreendimento.doc?.id}
                    setEmp={setEmpreendimento}
                    parentList={parentList}
                    local={stepCfg.local ?? null}
                />
            </main>

            <footer className={styles.buttonsArea}>
                <button onClick={voltar} className={styles.button}>
                    Voltar
                </button>

                {current < total ? (
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
}

export default Empreendimento;