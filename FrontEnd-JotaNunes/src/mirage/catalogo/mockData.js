import { NodeLevelMock, NodeMock, AmbienteMock, ItemMock} from "./mockDTOs.js";

// Sequência: Marca -> Material -> Item -> Ambiente -> Padrão
// - next(marca) = material
// - next(material) = item
// - next(item) = ambiente
// - next(ambiente) = padrão
// - Padrões não possuem relNext

const padraoLevel = new NodeLevelMock("padrao", [
    new NodeMock(1, "Padrão A", true, "padrao"),
    new NodeMock(2, "Padrão B", false, "padrao"),
    new NodeMock(3, "Padrão C", true, "padrao")
]);

const ambienteLevel = new NodeLevelMock("ambiente", [
    new AmbienteMock(1, "Ambiente A", true, "ambiente", [], [], "Local A"),
    new AmbienteMock(2, "Ambiente B", false, "ambiente", [], [], "Local A"),
    new AmbienteMock(3, "Ambiente C", true, "ambiente", [], [], "Local B")
]);

const itemLevel = new NodeLevelMock("item", [
    new ItemMock(1, "Item A", true, "item", [], [], "tipo A", null, null, "Descrição do Item A"),
    new ItemMock(2, "Item B", false, "item", [], [], "tipo B", null, "5cm", "Descrição do Item B"),
    new ItemMock(3, "Item C", true, "item", [], [], "tipo C", "3cm", null, "Descrição do Item C"),
    new ItemMock(4, "Item D", true, "item", [], [], "tipo D", "4cm", "6cm", "Descrição do Item D"),
    new ItemMock(5, "Item E", false, "item", [], [], "tipo E", null, null, "Descrição do Item E")
]);

const materialLevel = new NodeLevelMock("material",  [
    new NodeMock(1, "Material A", true, "material"),
    new NodeMock(2, "Material B", false, "material"),
    new NodeMock(3, "Material C", true, "material"),
    new NodeMock(4, "Material D", true, "material"),
    new NodeMock(5, "Material E", false, "material"),
    new NodeMock(6, "Material F", true, "material")
]);

const marcaLevel = new NodeLevelMock("marca", [
    new NodeMock(1, "Marca A", true, "marca"),
    new NodeMock(2, "Marca B", false, "marca"),
    new NodeMock(3, "Marca C", true, "marca")
]);

const getRandomSubset = (arr, min = 1, max = arr.length) => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const addRelReflexive = (source, relType, target) => {
    const targetType = relType === "next" ? "prev" : "next";

    source[`rel${relType.charAt(0).toUpperCase() + relType.slice(1)}`] ??= [];
    target[`rel${targetType.charAt(0).toUpperCase() + targetType.slice(1)}`] ??= [];

    if (!source[`rel${relType.charAt(0).toUpperCase() + relType.slice(1)}`].some(n => n.id === target.id)) {
        source.addRel(relType, target);
    }

    if (!target[`rel${targetType.charAt(0).toUpperCase() + targetType.slice(1)}`].some(n => n.id === source.id)) {
        target.addRel(targetType, source);
    }
};

ambienteLevel.nodeList.forEach(ambiente => {
    const relatedPadroes = getRandomSubset(padraoLevel.nodeList, 1, padraoLevel.nodeList.length);
    relatedPadroes.forEach(padrao => addRelReflexive(ambiente, "next", padrao));
});

itemLevel.nodeList.forEach(item => {
    const relatedAmbientes = getRandomSubset(ambienteLevel.nodeList, 1, ambienteLevel.nodeList.length);
    relatedAmbientes.forEach(ambiente => addRelReflexive(item, "next", ambiente));
});

materialLevel.nodeList.forEach(material => {
    const relatedItems = getRandomSubset(itemLevel.nodeList, 1, itemLevel.nodeList.length);
    relatedItems.forEach(item => addRelReflexive(material, "next", item));
});

marcaLevel.nodeList.forEach(marca => {
    const relatedMaterials = materialLevel.nodeList.filter(material => material.id === marca.id)
        .concat(getRandomSubset(materialLevel.nodeList.filter(m => m.id !== marca.id), 0, 2));
    relatedMaterials.forEach(material => addRelReflexive(marca, "next", material));
});

export const specs = [
    padraoLevel,
    ambienteLevel,
    itemLevel,
    materialLevel,
    marcaLevel
];