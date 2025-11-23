export const DocStatus = {
    APROVADO: "Aprovado",
    REJEITADO: "Rejeitado",
    UNSET: "Pendente"
}

export const isApproved = (revObj, field) => {
    if (!revObj || typeof revObj[field] === "undefined" || revObj[field] === null) {
        return DocStatus.UNSET;
    }
    return revObj[field] ? DocStatus.APROVADO : DocStatus.REJEITADO;
};
