const updateSpecDoc = (doc, params) => {
    const {
        docType,
        localId,
        ambienteId,
        updatedFields,
        rowId,
        remove = false
    } = params;

    if (remove) {
        if (docType === "local") {
            return {
                ...doc,
                locais: doc.locais.filter(local => local.id !== rowId)
            };
        }

        if (docType === "ambiente") {
            return {
                ...doc,
                locais: doc.locais.map(local =>
                    local.id !== localId
                        ? local
                        : {
                            ...local,
                            ambientes: local.ambientes.filter(
                                amb => amb.id !== rowId
                            )
                        }
                )
            };
        }

        if (docType === "item") {
            return {
                ...doc,
                locais: doc.locais.map(local =>
                    local.id !== localId
                        ? local
                        : {
                            ...local,
                            ambientes: local.ambientes.map(amb =>
                                amb.id !== ambienteId
                                    ? amb
                                    : {
                                        ...amb,
                                        items: amb.items.filter(
                                            item => item.id !== rowId
                                        )
                                    }
                            )
                        }
                )
            };
        }
    }

    return {
        ...doc,
        locais: doc.locais.map(local => {
            if (docType === "local" && local.id === rowId) {
                return { ...local, ...updatedFields };
            }

            if (local.id !== localId) return local;

            return {
                ...local,
                ambientes: local.ambientes.map(amb => {
                    if (docType === "ambiente" && amb.id === rowId) {
                        return { ...amb, ...updatedFields };
                    }

                    if (amb.id !== ambienteId) return amb;

                    return {
                        ...amb,
                        items: amb.items.map(item => {
                            if (docType === "item" && item.id === rowId) {
                                return { ...item, ...updatedFields };
                            }
                            return item;
                        })
                    };
                })
            };
        })
    };
};

export const updateElementInDoc = (doc, row, updatedDocElement, remove = false) => {
    return updateSpecDoc(doc, {
        docType: row.docType_,
        localId: row.localId_,
        ambienteId: row.ambienteId_,
        itemId: row.itemId_,
        updatedFields: updatedDocElement,
        rowId: row.id_,
        remove
    });
};