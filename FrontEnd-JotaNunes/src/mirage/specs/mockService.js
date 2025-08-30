import { pluralize } from "inflection";

const getNodeLevel = (schema, levelName) => {
    const collection = schema.db[pluralize(levelName)];
    console.log(schema);
    if (!collection) throw new Error(`Nível '${levelName}' não encontrado`);
    return collection;
};

const getNodeById = (schema, levelName, nodeId) => {
    const node = schema.db[pluralize(levelName)].find(nodeId);
    if (!node) throw new Error(`Nó '${nodeId}' não encontrado em '${levelName}'`);
    return node;
};

const getNodeByName = (schema, levelName, nodeName) => {
    const node = schema.db[pluralize(levelName)].findBy({ name: nodeName });
    if (!node) throw new Error(`Nó '${nodeName}' não encontrado em '${levelName}'`);
    return node;
};

const addNodeToLevel = (schema, levelName, nodeData) => {
    const collection = getNodeLevel(schema, levelName);

    if (nodeData.id && collection.find(nodeData.id)) {
        throw new Error(`Nó com id '${nodeData.id}' já existe em '${levelName}'`);
    }

    return schema[levelName].create(nodeData);
};

const addNodeRel = (getNodeFn, schema, sourceLevel, source, targetLevel, target, relType) => {
    const node = getNodeFn(schema, sourceLevel, source);
    const relNode = getNodeFn(schema, targetLevel, target);

    if (!node || !relNode) throw new Error("Nó ou nó relacionado não encontrado");

    const relKey = relType === "next" ? "relNextIds" : "relPrevIds";
    const inverseKey = relType === "next" ? "relPrevIds" : "relNextIds";

    const updatedNode = {
        ...node.attrs,
        [relKey]: [...new Set([...(node.attrs[relKey] || []), relNode.id])],
    };

    const updatedRelNode = {
        ...relNode.attrs,
        [inverseKey]: [...new Set([...(relNode.attrs[inverseKey] || []), node.id])],
    };

    node.update(updatedNode);
    relNode.update(updatedRelNode);

    return { source: node.attrs, target: relNode.attrs };
};

const addNodeRelById = (schema, nodeLevel, nodeId, relNodeLevel, relNodeId, relType) =>
    addNodeRel(getNodeById, schema, nodeLevel, nodeId, relNodeLevel, relNodeId, relType);

const addNodeRelByName = (schema, nodeLevel, nodeName, relNodeLevel, relNodeName, relType) =>
    addNodeRel(getNodeByName, schema, nodeLevel, nodeName, relNodeLevel, relNodeName, relType);

const updateNode = (schema, levelName, nodeData) => {
    const node = getNodeById(schema, levelName, nodeData.id);
    node.update(nodeData);
    return node.attrs;
};

const deleteNode = (schema, levelName, nodeId) => {
    const node = getNodeById(schema, levelName, nodeId);

    (node.attrs.relNextIds || []).forEach((relId) => {
        const relNode = getNodeById(schema, levelName, relId);
        relNode.update({
        relPrevIds: (relNode.attrs.relPrevIds || []).filter((id) => id !== nodeId),
        });
    });

    (node.attrs.relPrevIds || []).forEach((relId) => {
        const relNode = getNodeById(schema, levelName, relId);
        relNode.update({
        relNextIds: (relNode.attrs.relNextIds || []).filter((id) => id !== nodeId),
        });
    });

    node.destroy();
    return { id: nodeId, removed: true };
};

const delNodeRel = (schema, nodeLevel, nodeId, relNodeLevel, relNodeId, relType) => {
    const node = getNodeById(schema, nodeLevel, nodeId);
    const relNode = getNodeById(schema, relNodeLevel, relNodeId);

    const relKey = relType === "next" ? "relNextIds" : "relPrevIds";
    const inverseKey = relType === "next" ? "relPrevIds" : "relNextIds";

    node.update({
        [relKey]: (node.attrs[relKey] || []).filter((id) => id !== relNodeId),
    });

    relNode.update({
        [inverseKey]: (relNode.attrs[inverseKey] || []).filter((id) => id !== nodeId),
    });

    return { source: node.attrs, target: relNode.attrs, relationRemoved: true };
};

export const specService = {
    getNodeLevel,
    getNodeById,
    getNodeByName,
    addNodeToLevel,
    addNodeRelById,
    addNodeRelByName,
    updateNode,
    deleteNode,
    delNodeRel,
};