import React, { useState, useEffect } from "react";
import EmpreendimentoForm from "./EmpreendimentoForm";
import EspecificacaoForm from "./EspecificacaoForm";

const FormPage = () => {
    const [title, setTitle] = useState("");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [currentStep, setCurrentStep] = useState(0);

    const [stepStore] = useState({
        0: EmpreendimentoForm,
        1: EspecificacaoForm,
    });

    const handleNext = () => setCurrentStep((prev) => (prev === 0 ? 1 : 0));

    const StepComponent = stepStore[currentStep];

    return (
        <div className={styles.mainArea}>
            <StepComponent
                title={title}
                onChange={(e) => setTitle(e.target.value)}
                name={name}
                onNameChange={(e) => setName(e.target.value)}
                desc={desc}
                onDescChange={(e) => setDesc(e.target.value)}
            />
            <button onClick={handleNext}>Próximo</button>
        </div>
    );
};

export default FormPage;