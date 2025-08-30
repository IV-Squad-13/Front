import { hasMany, Model } from "miragejs";

export const models = {
    user: Model,

    marca: Model.extend({
        materialList: hasMany("material"),
    }),
    material: Model.extend({
        marcaList: hasMany("marca"),
        itemList: hasMany("item"),
    }),
    item: Model.extend({
        materialList: hasMany("material"),
        ambienteList: hasMany("ambiente"),
    }),
    ambiente: Model.extend({
        itemList: hasMany("item"),
        padraoList: hasMany("padrao"),
    }),
    padrao: Model.extend({
        ambienteList: hasMany("ambiente"),
    }),
}