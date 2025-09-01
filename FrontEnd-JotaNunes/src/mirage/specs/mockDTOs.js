export class NodeLevelMock {
    constructor(nome, nodeList) {
        this.nome = nome;
        this.nodeList = nodeList;
    }
}

export class NodeMock {
    constructor(id, nome, isAtivo, level, relPrev = [], relNext = []) {
        this.id = id;
        this.nome = nome;
        this.isAtivo = isAtivo;
        this.level = level;
        this.relPrev = relPrev;
        this.relNext = relNext;
    }

    addRel(relType, node) {
        if (relType === "prev") {
            this.relPrev.push(node);
        } else if (relType === "next") {
            this.relNext.push(node);
        }
    }

    removeRel(relType, node) {
        if (relType === "prev") {
            this.relPrev = this.relPrev.filter(n => n !== node);
        } else if (relType === "next") {
            this.relNext = this.relNext.filter(n => n !== node);
        }
    }

    findRel(relType, node) {
        if (relType === "prev") {
            return this.relPrev.find(n => n === node);
        } else if (relType === "next") {
            return this.relNext.find(n => n === node);
        }
        return null;
    }
}

export class AmbienteMock extends NodeMock {
    constructor(id, nome, isAtivo, level, relPrev = [], relNext = [], local) {
        super(id, nome, isAtivo, level, relPrev, relNext);
        this.local = local;
    }
}

export class ItemMock extends NodeMock {
    constructor(id, nome, isAtivo, level, relPrev = [], relNext = [], tpItem, largura, altura, descricao) {
        super(id, nome, isAtivo, level, relPrev, relNext);
        this.tpItem = tpItem;
        this.largura = largura;
        this.altura = altura;
        this.descricao = descricao;
    }
}