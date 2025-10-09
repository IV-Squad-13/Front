import { describe, beforeEach, afterEach, test, expect } from "vitest";
import { makeServer } from "../src/mirage/server";

let server;

describe("Testes de Usuários", () => {
  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  test("GET /mock/users retorna usuários pré-definidos", async () => {
    const res = await fetch("/mock/auth/users");
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.users).toBeDefined();
    expect(json.users[0].name).toBe("Paulo Silva");
  });
});

describe("Testes de Especificações", () => {
  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  const levelList = ["marca", "material", "item", "ambiente", "padrao"];

  test("GET /mock/catalogo/:level retorna especificações pré-definidas em cada nível", async () => {
    for (const level of levelList) {
      const res = await fetch(`/mock/catalogo/${level}`);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toBeDefined();
      expect(Array.isArray(json)).toBe(true);
    }
  });

  test("GET /mock/catalogo/:level/id/:id retorna uma especificação pelo id fornecido", async () => {
    for (const level of levelList) {
      const res = await fetch(`/mock/catalogo/${level}/id/1`);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.spec).toBeDefined();
      expect(json.spec.id).toBe("1");
    }
  });

  test("GET /mock/catalogo/:level/name/:name retorna uma especificação pelo nome fornecido", async () => {
    const res = await fetch(`/mock/catalogo/marca/name/Marca A`);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.spec).toBeDefined();
    expect(json.spec.name).toBe("Marca A");
  });

  test("POST /mock/catalogo/:level cria uma nova especificação", async () => {
    const newSpec = { name: "Nova Marca", active: true };
    const res = await fetch(`/mock/catalogo/marca`, {
      method: "POST",
      body: JSON.stringify(newSpec),
    });
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toBeDefined();
    expect(json.marca.name).toBe("Nova Marca");
    expect(json.marca.active).toBe(true);
  });

  test("PUT /mock/catalogo/:level/:id atualiza uma especificação existente", async () => {
    const update = { name: "Marca Atualizada" };
    const res = await fetch(`/mock/catalogo/marca/1`, {
      method: "PUT",
      body: JSON.stringify(update),
    });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toBeDefined();
    expect(json.name).toBe("Marca Atualizada");
  });

  test("DELETE /mock/catalogo/:level/:id inativa uma especificação", async () => {
    const res = await fetch(`/mock/catalogo/marca/1`, { method: "DELETE" });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.deleted.inactive).toBe(true);

    const checkRes = await fetch(`/mock/catalogo/marca/id/1`);
    expect(checkRes.status).toBe(404);
  });

  test("POST /mock/catalogo/:level/:id/rels adiciona relação entre especificações", async () => {
    const rel = { relSpecId: "3", relSpecLevel: "material", relType: "next" };
    const res = await fetch(`/mock/catalogo/marca/1/rels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rel),
    });
    const json = await res.json();

    expect(res.status).toBe(200);

    expect(json.source).toBeDefined();
    expect(Array.isArray(json.source.nextRelIds)).toBe(true);
    expect(json.source.nextRelIds.length).toBeGreaterThan(0);

    expect(json.target).toBeDefined();
    expect(Array.isArray(json.target.prevRelIds)).toBe(true);
    expect(json.target.prevRelIds.length).toBeGreaterThan(0);
  });

  test("DELETE /mock/catalogo/:level/:id/rels removes relação entre especificações", async () => {
    const rel = { relSpecId: 1, relSpecLevel: "material", relType: "next" };

    const res = await fetch(`/mock/catalogo/marca/1/rels`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rel),
    });

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.specs).toBeDefined();

    const { source, target, relType } = json.specs;

    expect(source.nextRelIds).not.toContain(rel.relSpecId);
    expect(target.prevRelIds).not.toContain(1);

    expect(relType).toBe(rel.relType);
    expect(json.specs.relationRemoved).toBe(true);
  });
});