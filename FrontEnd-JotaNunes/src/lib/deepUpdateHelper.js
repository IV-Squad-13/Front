const updateSpecDoc = (doc, params) => {
    const {
        docType,
        localId,
        ambienteId,
        rowId,
        updatedFields,
        newElement,
        newElementList,
        remove = false,
        nmLocal
    } = params;

    if (remove) {
        if (docType === "local") {
            return {
                ...doc,
                locais: doc.locais.filter(l => l.id !== rowId)
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
                            ambientes: local.ambientes.filter(a => a.id !== rowId)
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
                            ambientes: local.ambientes.map(a =>
                                a.id !== ambienteId
                                    ? a
                                    : {
                                        ...a,
                                        items: a.items.filter(i => i.id !== rowId)
                                    }
                            )
                        }
                )
            };
        }
    }

    if (newElement || newElementList) {
        const toAdd = newElementList ?? [newElement];

        const dedupeById = (arr) =>
            arr.filter(
                (el, idx, self) =>
                    idx === self.findIndex(x => x.id === el.id)
            );

        if (docType === "local") {
            const merged = [...doc.locais, ...toAdd];
            return {
                ...doc,
                locais: dedupeById(merged)
            };
        }

        if (docType === "ambiente") {
            return {
                ...doc,
                locais: doc.locais.map(local => {
                    if (local.id !== localId && local.local !== nmLocal) {
                        return local;
                    }

                    const merged = [...local.ambientes, ...toAdd];
                    return {
                        ...local,
                        ambientes: dedupeById(merged)
                    };
                })
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
                                        items: dedupeById([
                                            ...amb.items,
                                            ...toAdd
                                        ])
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

export const updateElementInDoc = (
    doc,
    row,
    updatedDocElement,
    remove = false,
    newElement = null,
    newElementList = null
) => {
    const d = updateSpecDoc(doc, {
        docType: row.docType_,
        localId: row.localId_,
        ambienteId: row.ambienteId_,
        rowId: row.id_,
        updatedFields: updatedDocElement,
        newElement,
        newElementList,
        remove,
        nmLocal: row.local
    });

    console.log(d);
    return d;
};
