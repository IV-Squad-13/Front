import { createServer, Response } from "miragejs";
import { userService } from "./user/mockService";
import { specService } from "./specs/mockService";
import { users } from "./user/mockData";
import { models } from "./models";
import { populateSchema } from "./seeds";

const safeHandler = (handler) => (schema, req) => {
    try {
        return handler(schema, req);
    } catch (e) {
        return new Response(400, {}, { error: e.message });
    }
};

export const makeServer = () => {
    return createServer({
        models: models,

        seeds(server) {
            populateSchema(server, users);
        },

        routes() {
            this.namespace = "mock";

            this.get("/users", safeHandler((schema, req) => userService.getAllUsers(schema, req)));
            this.post("/user/login", safeHandler((schema, req) => userService.loginUser(schema, req)));
            this.post("/user", safeHandler((schema, req) => userService.createUser(schema, req)));
            this.put("/user/:id", safeHandler((schema, req) => userService.updateUser(schema, req)));


            this.get("/specs/:level", safeHandler((schema, req) => {
                const { level } = req.params;
                return new Response(200, {}, { specs: specService.getSpecLevel(schema, level) });
            }));

            this.get("/specs/:level/:id", safeHandler((schema, req) => {
                const spec = specService.getSpecById(schema, req.params.level, parseInt(req.params.id));
                if (!spec) return new Response(404, {}, { error: "Spec not found" });
                return new Response(200, {}, { spec });
            }));

            this.post("/specs/:level", safeHandler((schema, req) => {
                const spec = JSON.parse(req.requestBody);
                const created = specService.addSpecToLevel(schema, req.params.level, spec);
                return new Response(201, {}, { spec: created });
            }));

            this.put("/specs/:level/:id", safeHandler((schema, req) => {
                const spec = JSON.parse(req.requestBody);
                spec.id = parseInt(req.params.id);
                const updated = specService.updateSpec(schema, req.params.level, spec);
                return new Response(200, {}, { spec: updated });
            }));

            this.delete("/specs/:level/:id", safeHandler((schema, req) => {
                const deleted = specService.deleteSpec(schema, req.params.level, parseInt(req.params.id));
                return new Response(200, {}, { deleted });
            }));

            this.post("/specs/:level/:id/rels", safeHandler((schema, req) => {
                const { relSpecId, relSpecLevel, relType } = JSON.parse(req.requestBody);
                const updated = specService.addSpecRelById(
                    schema,
                    req.params.level,
                    parseInt(req.params.id),
                    relSpecLevel,
                    parseInt(relSpecId),
                    relType
                );
                return new Response(200, {}, { spec: updated });
            }));

            this.delete("/specs/:level/:id/rels", safeHandler((schema, req) => {
                const { relSpecId, relSpecLevel, relType } = JSON.parse(req.requestBody);
                const updated = specService.delSpecRel(
                    schema,
                    req.params.level,
                    parseInt(req.params.id),
                    relSpecLevel,
                    parseInt(relSpecId),
                    relType
                );
                return new Response(200, {}, { spec: updated });
            }));
        },
    });
};