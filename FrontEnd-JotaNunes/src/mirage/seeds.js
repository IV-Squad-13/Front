export const populateSchema = (server, users) => {
    users.forEach((u) => server.create("user", u));

    const marcaA = server.create("marca", { id: 1, name: "Marca A", active: true });
    const marcaB = server.create("marca", { id: 2, name: "Marca B", active: false });
    const marcaC = server.create("marca", { id: 3, name: "Marca C", active: true });

    const materialA = server.create("material", { id: 1, name: "Material A", active: true, marcaId: marcaA.id });
    const materialB = server.create("material", { id: 2, name: "Material B", active: false, marcaId: marcaB.id });
    const materialC = server.create("material", { id: 3, name: "Material C", active: true, marcaId: marcaC.id });
    const materialD = server.create("material", { id: 4, name: "Material D", active: true, marcaId: marcaA.id });
    const materialE = server.create("material", { id: 5, name: "Material E", active: false, marcaId: marcaB.id });
    const materialF = server.create("material", { id: 6, name: "Material F", active: true, marcaId: marcaC.id });

    const itemA = server.create("item", {
        id: 1,
        name: "Item A",
        active: true,
        type: "tipo A",
        description: "Descrição do Item A",
        materialId: materialA.id,
    });
    const itemB = server.create("item", {
        id: 2,
        name: "Item B",
        active: false,
        type: "tipo B",
        height: "5cm",
        description: "Descrição do Item B",
        materialId: materialB.id,
    });
    const itemC = server.create("item", {
        id: 3,
        name: "Item C",
        active: true,
        type: "tipo C",
        width: "3cm",
        description: "Descrição do Item C",
        materialId: materialC.id,
    });
    const itemD = server.create("item", {
        id: 4,
        name: "Item D",
        active: true,
        type: "tipo D",
        width: "4cm",
        height: "6cm",
        description: "Descrição do Item D",
        materialId: materialD.id,
    });
    const itemE = server.create("item", {
        id: 5,
        name: "Item E",
        active: false,
        type: "tipo E",
        description: "Descrição do Item E",
        materialId: materialE.id,
    });

    const ambienteA = server.create("ambiente", {
        id: 1,
        name: "Ambiente A",
        active: true,
        local: "Local A",
        itemId: itemA.id,
    });
    const ambienteB = server.create("ambiente", {
        id: 2,
        name: "Ambiente B",
        active: false,
        local: "Local A",
        itemId: itemB.id,
    });
    const ambienteC = server.create("ambiente", {
        id: 3,
        name: "Ambiente C",
        active: true,
        local: "Local B",
        itemId: itemC.id,
    });

    server.create("padrao", { id: 1, name: "Padrão A", active: true, ambienteId: ambienteA.id });
    server.create("padrao", { id: 2, name: "Padrão B", active: false, ambienteId: ambienteB.id });
    server.create("padrao", { id: 3, name: "Padrão C", active: true, ambienteId: ambienteC.id });
};