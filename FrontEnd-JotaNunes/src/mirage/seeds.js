import { specs } from "./specs/mockData";

const createNode = (server, node) => {
    const baseAttrs = {
        id: node.id,
        name: node.nome,
        active: node.isAtivo,
        type: node.type || undefined,
        nextRelIds: [],
        prevRelIds: []
    };

    if (node.tpItem !== undefined) baseAttrs.tpItem = node.tpItem;
    if (node.largura !== undefined) baseAttrs.largura = node.largura;
    if (node.altura !== undefined) baseAttrs.altura = node.altura;
    if (node.descricao !== undefined) baseAttrs.descricao = node.descricao;

    if (node.local !== undefined) baseAttrs.local = node.local;

    if (node.ds_item) baseAttrs.ds_item = node.ds_item;

    return server.create(node.level, baseAttrs);
};

const linkNodeRels = (server, node, createdNodesMap) => {
    const source = createdNodesMap[node.level][node.id];

    if (node.relNext) {
        node.relNext.forEach(targetNode => {
            const target = createdNodesMap[targetNode.level][targetNode.id];

            source.nextRel ??= { models: [], add: arr => arr.forEach(m => source.nextRel.models.push(m)) };
            source.nextRel.add([target]);
            source.attrs.nextRelIds.push(target.attrs.id);

            target.prevRel ??= { models: [], add: arr => arr.forEach(m => target.prevRel.models.push(m)) };
            target.prevRel.add([source]);
            target.attrs.prevRelIds.push(source.attrs.id);
        });
    }

    if (node.relPrev) {
        node.relPrev.forEach(targetNode => {
            const target = createdNodesMap[targetNode.level][targetNode.id];

            source.prevRel ??= { models: [], add: arr => arr.forEach(m => source.prevRel.models.push(m)) };
            source.prevRel.add([target]);
            source.attrs.prevRelIds.push(target.attrs.id);

            target.nextRel ??= { models: [], add: arr => arr.forEach(m => target.nextRel.models.push(m)) };
            target.nextRel.add([source]);
            target.attrs.nextRelIds.push(source.attrs.id);
        });
    }
};

export const populateSchema = (server, users) => {
    users?.forEach(u => server.create("user", u));

    const createdNodesMap = {};

    specs.forEach(level => {
        createdNodesMap[level.nome] = {};
        level.nodeList.forEach(node => {
            const created = createNode(server, node);
            createdNodesMap[level.nome][node.id] = created;
        });
    });

    specs.forEach(level => {
        level.nodeList.forEach(node => linkNodeRels(server, node, createdNodesMap));
    });
};