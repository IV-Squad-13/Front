import { pluralize } from "inflection";
import { handleError } from "../errorhandler";

const getSpecLevel = (schema, levelName) => {
    const collection = schema[pluralize(levelName)];
    if (!collection) handleError(`Nível '${levelName}' não encontrado`, 404);
    return collection.all().models.filter(spec => spec.attrs.active);
};

const getSpecById = (schema, levelName, specId) => {
    const spec = schema[pluralize(levelName)].find(specId);
    if (!spec || !spec.attrs.active) {
        handleError(`Especificação '${specId}' não encontrada ou inativa em '${levelName}'`, 404);
    }
    return spec;
};

const getSpecByName = (schema, levelName, specName) => {
    const spec = schema[pluralize(levelName)].findBy({ name: specName });
    if (!spec || !spec.attrs.active) {
        handleError(`Especificação '${specName}' não encontrada ou inativa em '${levelName}'`, 404);
    }
    return spec;
};

const getSpecModel = (schema, levelName, specId) => {
    const spec = schema[pluralize(levelName)].find(specId);
    if (!spec) handleError(`Especificação '${specId}' não encontrada em '${levelName}'`, 404);
    return spec;
};

const addSpecToLevel = (schema, levelName, specData) => {
    const collection = schema[pluralize(levelName)];
    if (specData.id && collection.find(specData.id)) {
        handleError(`Especificação com id '${specData.id}' já existe em '${levelName}'`, 400);
    }
    return collection.create({ ...specData, active: true });
};

const checkForExistingRelation = (spec, relSpec, relType) => {
    const relIds = relType === "next" ? spec.attrs.nextRelIds || [] : spec.attrs.prevRelIds || [];
    return relIds.includes(relSpec.attrs.id);
};

const addSpecRel = (getSpecFn, schema, sourceLevel, source, targetLevel, target, relType) => {
    const spec = getSpecFn(schema, sourceLevel, source);
    const relSpec = getSpecFn(schema, targetLevel, target);

    if (!spec.attrs.active || !relSpec.attrs.active) {
        handleError("Não é possível criar relação com especificações inativas", 400);
    }

    const addRelation = (fromSpec, toSpec, type) => {
        const relKey = type === "next" ? "nextRel" : "prevRel";
        const idsKey = type === "next" ? "nextRelIds" : "prevRelIds";
        const oppositeRelKey = type === "next" ? "prevRel" : "nextRel";
        const oppositeIdsKey = type === "next" ? "prevRelIds" : "nextRelIds";

        fromSpec[relKey] ??= { models: [], add: arr => arr.forEach(m => fromSpec[relKey].models.push(m)) };
        toSpec[oppositeRelKey] ??= { models: [], add: arr => arr.forEach(m => toSpec[oppositeRelKey].models.push(m)) };

        if (!checkForExistingRelation(fromSpec, toSpec, type)) {
            fromSpec[relKey].add([toSpec]);
            fromSpec.attrs[idsKey] ??= [];
            fromSpec.attrs[idsKey].push(toSpec.attrs.id);

            toSpec[oppositeRelKey].add([fromSpec]);
            toSpec.attrs[oppositeIdsKey] ??= [];
            toSpec.attrs[oppositeIdsKey].push(fromSpec.attrs.id);
        }
    };

    if (relType === "next" || relType === "prev") {
        addRelation(spec, relSpec, relType);
    } else {
        handleError(`Tipo de relação '${relType}' não suportado`, 400);
    }

    return { source: spec.attrs, target: relSpec.attrs };
};

const addSpecRelById = (schema, specLevel, specId, relSpecLevel, relSpecId, relType) =>
    addSpecRel(getSpecById, schema, specLevel, specId, relSpecLevel, relSpecId, relType);

const addSpecRelByName = (schema, specLevel, specName, relSpecLevel, relSpecName, relType) =>
    addSpecRel(getSpecByName, schema, specLevel, specName, relSpecLevel, relSpecName, relType);

const updateSpec = (schema, levelName, specData) => {
    const spec = getSpecById(schema, levelName, specData.id);
    spec.update(specData);
    return spec.attrs;
};

const deleteSpec = (schema, levelName, specId) => {
    const spec = getSpecModel(schema, levelName, specId);
    spec.update({ active: false });
    return { id: specId, inactive: true };
};

const delSpecRel = (schema, sourceLevel, sourceId, targetLevel, targetId, relType) => {
    const spec = getSpecModel(schema, sourceLevel, sourceId);
    const relSpec = getSpecModel(schema, targetLevel, targetId);

    if (!spec.attrs.active || !relSpec.attrs.active) {
        handleError("Não é possível remover relação de especificações inativas", 400);
    }

    const removeRelation = (fromSpec, toSpec, type) => {
        const idsKey = type === "next" ? "nextRelIds" : "prevRelIds";
        const oppositeIdsKey = type === "next" ? "prevRelIds" : "nextRelIds";

        fromSpec.attrs[idsKey] ??= [];
        toSpec.attrs[oppositeIdsKey] ??= [];

        if (!fromSpec.attrs[idsKey].includes(toSpec.attrs.id)) {
            handleError(`Relação '${type}' não encontrada para remoção`, 404);
        }

        fromSpec.attrs[idsKey] = fromSpec.attrs[idsKey].filter(id => id !== toSpec.attrs.id);

        toSpec.attrs[oppositeIdsKey] = toSpec.attrs[oppositeIdsKey].filter(id => id !== fromSpec.attrs.id);
    };

    if (relType === "next" || relType === "prev") {
        removeRelation(spec, relSpec, relType);
    } else {
        handleError(`Tipo de relação '${relType}' não suportado para remoção`, 400);
    }

    return {
        specs: {
            source: spec.attrs,
            target: relSpec.attrs,
            relType,
            relationRemoved: true
        }
    };
};

export const specService = {
    getSpecLevel,
    getSpecById,
    getSpecByName,
    addSpecToLevel,
    addSpecRelById,
    addSpecRelByName,
    updateSpec,
    deleteSpec,
    delSpecRel,
};