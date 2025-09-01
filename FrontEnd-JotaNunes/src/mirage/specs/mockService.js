import { pluralize } from "inflection";

const getSpecLevel = (schema, levelName) => {
    const collection = schema.db[pluralize(levelName)];
    if (!collection) throw new Error(`Nível '${levelName}' não encontrado`);
    return collection;
};

const getSpecById = (schema, levelName, specId) => {
    const spec = schema.db[pluralize(levelName)].find(specId);
    if (!spec) throw new Error(`Nó '${specId}' não encontrado em '${levelName}'`);
    return spec;
};

const getSpecByName = (schema, levelName, specName) => {
    const spec = schema.db[pluralize(levelName)].findBy({ name: specName });
    if (!spec) throw new Error(`Nó '${specName}' não encontrado em '${levelName}'`);
    return spec;
};

const addSpecToLevel = (schema, levelName, specData) => {
    const collection = getSpecLevel(schema, levelName);

    if (specData.id && collection.find(specData.id)) {
        throw new Error(`Nó com id '${specData.id}' já existe em '${levelName}'`);
    }

    return schema[levelName].create(specData);
};

const addSpecRel = (getSpecFn, schema, sourceLevel, source, targetLevel, target, relType) => {
    const spec = getSpecFn(schema, sourceLevel, source);
    const relSpec = getSpecFn(schema, targetLevel, target);

    if (!spec || !relSpec) throw new Error("Nó ou nó relacionado não encontrado");

    const relKey = relType === "next" ? "relNextIds" : "relPrevIds";
    const inverseKey = relType === "next" ? "relPrevIds" : "relNextIds";

    const updatedSpec = {
        ...spec.attrs,
        [relKey]: [...new Set([...(spec.attrs[relKey] || []), relSpec.id])],
    };

    const updatedRelSpec = {
        ...relSpec.attrs,
        [inverseKey]: [...new Set([...(relSpec.attrs[inverseKey] || []), spec.id])],
    };

    spec.update(updatedSpec);
    relSpec.update(updatedRelSpec);

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
    const spec = getSpecById(schema, levelName, specId);

    (spec.attrs.relNextIds || []).forEach((relId) => {
        const relSpec = getSpecById(schema, levelName, relId);
        relSpec.update({
        relPrevIds: (relSpec.attrs.relPrevIds || []).filter((id) => id !== specId),
        });
    });

    (spec.attrs.relPrevIds || []).forEach((relId) => {
        const relSpec = getSpecById(schema, levelName, relId);
        relSpec.update({
        relNextIds: (relSpec.attrs.relNextIds || []).filter((id) => id !== specId),
        });
    });

    spec.destroy();
    return { id: specId, removed: true };
};

const delSpecRel = (schema, specLevel, specId, relSpecLevel, relSpecId, relType) => {
    const spec = getSpecById(schema, specLevel, specId);
    const relSpec = getSpecById(schema, relSpecLevel, relSpecId);

    const relKey = relType === "next" ? "relNextIds" : "relPrevIds";
    const inverseKey = relType === "next" ? "relPrevIds" : "relNextIds";

    spec.update({
        [relKey]: (spec.attrs[relKey] || []).filter((id) => id !== relSpecId),
    });

    relSpec.update({
        [inverseKey]: (relSpec.attrs[inverseKey] || []).filter((id) => id !== specId),
    });

    return { source: spec.attrs, target: relSpec.attrs, relationRemoved: true };
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