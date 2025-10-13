import { createServer, Response } from "miragejs";
import { userService } from "./user/mockService";
import { specService } from "./catalogo/mockService";
import { users } from "./user/mockData";
import { models } from "./models";
import { populateSchema } from "./seeds";

const safeHandler = (handler) => (schema, req) => {
  try {
    return handler(schema, req);
  } catch (e) {
    if (e instanceof Response) return e;
    if (e.status === 404) return new Response(404, {}, { error: e.message || "Not found" });

    return new Response(400, {}, { error: e.message || "Bad request" });
  }
};

export const makeServer = () => {
  return createServer({
    models,

    seeds(server) {
      populateSchema(server, users);
    },

    routes() {
      this.namespace = "mock";

      this.get("/auth/users", safeHandler(userService.getAllUsers));
      this.post("/auth/login", safeHandler(userService.loginUser));
      this.post("/auth/register", safeHandler(userService.createUser));
      this.put("/auth/:id", safeHandler(userService.updateUser));


      this.get("/catalogo/:level", safeHandler((schema, req) => {
        const { level } = req.params;
        return new Response(200, {}, specService.getSpecLevel(schema, level));
      }));

      this.get("/catalogo/:level/id/:id", safeHandler((schema, req) => {
        const spec = specService.getSpecById(schema, req.params.level, parseInt(req.params.id));
        return new Response(200, {}, { spec });
      }));

      this.get("/catalogo/:level/name/:name", safeHandler((schema, req) => {
        const spec = specService.getSpecByName(schema, req.params.level, req.params.name);
        return new Response(200, {}, { spec });
      }));

      this.post("/catalogo/:level", safeHandler((schema, req) => {
        const spec = JSON.parse(req.requestBody);
        const created = specService.addSpecToLevel(schema, req.params.level, spec);
        return new Response(201, {}, created );
      }));

      this.put("/catalogo/:level/:id", safeHandler((schema, req) => {
        const spec = JSON.parse(req.requestBody);
        spec.id = parseInt(req.params.id);
        const updated = specService.updateSpec(schema, req.params.level, spec);
        return new Response(200, {}, updated );
      }));

      this.delete("/catalogo/:level/:id", safeHandler((schema, req) => {
        const deleted = specService.deleteSpec(schema, req.params.level, parseInt(req.params.id));
        return new Response(200, {}, { deleted });
      }));

      this.post("/catalogo/:level/:id/rels", safeHandler((schema, req) => {
        const { relSpecId, relSpecLevel, relType } = JSON.parse(req.requestBody);
        const updated = specService.addSpecRelById(
          schema,
          req.params.level,
          parseInt(req.params.id),
          relSpecLevel,
          parseInt(relSpecId),
          relType
        );
        return new Response(200, {}, updated );
      }));

      this.delete("/catalogo/:level/:id/rels", safeHandler((schema, req) => {
        const { relSpecId, relSpecLevel, relType } = JSON.parse(req.requestBody);

        const updated = specService.delSpecRel(
          schema,
          req.params.level,
          parseInt(req.params.id, 10),
          relSpecLevel,
          parseInt(relSpecId, 10),
          relType
        );

        return new Response(200, {}, {
          specs: {
            source: updated.specs.source,
            target: updated.specs.target,
            relType: updated.specs.relType,
            relationRemoved: updated.specs.relationRemoved
          }
        });
      }));
    },
  });
};
