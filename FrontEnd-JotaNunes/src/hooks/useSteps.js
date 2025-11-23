import AssignmentWrapper from "@/components/assignmentWrapper/AssignmentWrapper";
import EmpreendimentoForm from "@/components/forms/EmpreendimentoForm/EmpreendimentoForm";
import EspecificacaoForm from "@/components/forms/EspecificacaoForm/EspecificacaoForm";
import { useMemo } from "react";

const useSteps = ({ empreendimento, saveEmp, saveSpec }) => {
  return useMemo(() => {
    const steps = [
      {
        key: "emp",
        Component: EmpreendimentoForm,
        title: "Bem vindo ao cadastro de Empreendimentos!",
        onSubmit: saveEmp ?? null,
        section: "start",
      },
      {
        key: "spec",
        Component: EspecificacaoForm,
        title: "Insira aqui os dados da nova Especificação",
        onSubmit: saveSpec ?? null,
        section: "start",
      },
      {
        key: "unidades",
        Component: AssignmentWrapper,
        title: `${empreendimento.name || "Empreendimento"} - Unidades privativas`,
        onSubmit: async () => ({ ok: true }),
        section: "ambientes",
        local: "UNIDADES_PRIVATIVAS",
      },
      {
        key: "area_comum",
        Component: AssignmentWrapper,
        title: `${empreendimento.name || "Empreendimento"} - Área comum`,
        onSubmit: async () => ({ ok: true }),
        section: "ambientes",
        local: "AREA_COMUM",
      },
      {
        key: "materiais",
        Component: AssignmentWrapper,
        title: `${empreendimento.name || "Empreendimento"} - Marcas e materiais`,
        onSubmit: async () => ({ ok: true }),
        section: "materiais",
      },
    ];

    return steps;
  }, [empreendimento, saveEmp, saveSpec]);
}

export default useSteps;