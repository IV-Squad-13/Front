// semi inutil

import { NodeLevelMock, NodeMock, AmbienteMock, ItemMock} from "./mockDTOs.js";

// Sequência: Marca -> Material -> Item -> Ambiente -> Padrão
// - next(marca) = material
// - next(material) = item
// - next(item) = ambiente
// - next(ambiente) = padrão
// - Padrões não possuem relNext

// Padrões
const padraoLevel = new NodeLevelMock("padrao", [
    new NodeMock(1, "Padrão A", true, "padrao"),
    new NodeMock(2, "Padrão B", false, "padrao"),
    new NodeMock(3, "Padrão C", true, "padrao")
]);

// Ambientes
const ambienteLevel = new NodeLevelMock("ambiente", [
    new AmbienteMock(1, "Ambiente A", true, "ambiente", [], [], "Local A"),
    new AmbienteMock(2, "Ambiente B", false, "ambiente", [], [], "Local A"),
    new AmbienteMock(3, "Ambiente C", true, "ambiente", [], [], "Local B")
]);

// Itens
const itemLevel = new NodeLevelMock("item", [
    new ItemMock(1, "Item A", true, "item", [], [], "tipo A", null, null, "Descrição do Item A"),
    new ItemMock(2, "Item B", false, "item", [], [], "tipo B", null, "5cm", "Descrição do Item B"),
    new ItemMock(3, "Item C", true, "item", [], [], "tipo C", "3cm", null, "Descrição do Item C"),
    new ItemMock(4, "Item D", true, "item", [], [], "tipo D", "4cm", "6cm", "Descrição do Item D"),
    new ItemMock(5, "Item E", false, "item", [], [], "tipo E", null, null, "Descrição do Item E")
]);

// Materiais
const materialLevel = new NodeLevelMock("material",  [
    new NodeMock(1, "Material A", true, "material"),
    new NodeMock(2, "Material B", false, "material"),
    new NodeMock(3, "Material C", true, "material"),
    new NodeMock(4, "Material D", true, "material"),
    new NodeMock(5, "Material E", false, "material"),
    new NodeMock(6, "Material F", true, "material")
]);

// Marcas
const marcaLevel = new NodeLevelMock("marca", [
    new NodeMock(1, "Marca A", true, "marca"),
    new NodeMock(2, "Marca B", false, "marca"),
    new NodeMock(3, "Marca C", true, "marca")
]);

// Relacionamentos meramente ilustrativos

// Relacionando ambientes com padrões
ambienteLevel.nodeList.forEach(ambiente => {
    padraoLevel.nodeList.forEach(padrao => {
        if (padrao.id === ambiente.id) {
            ambiente.addRel("next", padrao);
            padrao.addRel("prev", ambiente);
        }
    });
});

// Relacionando itens com ambientes
ambienteLevel.nodeList.forEach(ambiente => {
    itemLevel.nodeList.forEach(item => {
        if ((item.ambienteId === ambiente.id) || (item.id - 1 === ambiente.id)) {
            ambiente.addRel("prev", item);
            item.addRel("next", ambiente);
        }
    });
});

// Relacionando materiais com itens
itemLevel.nodeList.forEach(item => {
    materialLevel.nodeList.forEach(material => {
        if ((item.id === material.id) || (item.id - 1 === material.id)) {
            item.addRel("prev", material);
            material.addRel("next", item);
        }
    });
});

// Relacionando marcas com materiais
materialLevel.nodeList.forEach(material => {
    marcaLevel.nodeList.forEach(marca => {
        material.addRel("prev", marca);
        marca.addRel("next", material);
    });
});

export const specs = [
    padraoLevel,
    ambienteLevel,
    itemLevel,
    materialLevel,
    marcaLevel
];