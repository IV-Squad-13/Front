import { createServer, hasMany, Model, Response } from "miragejs";
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
            this.get("/user/:id", safeHandler((schema, req) => userService.getUserById(schema, req)));
            this.post("/user/login", safeHandler((schema, req) => userService.loginUser(schema, req)));
            this.post("/user", safeHandler((schema, req) => userService.createUser(schema, req)));
            this.put("/user/:id", safeHandler((schema, req) => userService.updateUser(schema, req)));
            this.delete("/user/:id", safeHandler((schema, req) => userService.deleteUser(schema, req)));

            this.get("/specs/:level", safeHandler((schema, req) => {
                const { level } = req.params;
                console.log(level);
                return new Response(200, {}, { specs: specService.getNodeLevel(schema, level) });
            }));

            this.get("/specs/:level/:id", safeHandler((schema, req) => {
                const node = specService.getNodeById(schema, req.params.level, parseInt(req.params.id));
                if (!node) return new Response(404, {}, { error: "Node not found" });
                return new Response(200, {}, { node });
            }));

            this.post("/specs/:level", safeHandler((schema, req) => {
                const node = JSON.parse(req.requestBody);
                const created = specService.addNodeToLevel(schema, req.params.level, node);
                return new Response(201, {}, { node: created });
            }));

            this.put("/specs/:level/:id", safeHandler((schema, req) => {
                const node = JSON.parse(req.requestBody);
                node.id = parseInt(req.params.id);
                const updated = specService.updateNode(schema, req.params.level, node);
                return new Response(200, {}, { node: updated });
            }));

            this.delete("/specs/:level/:id", safeHandler((schema, req) => {
                const deleted = specService.deleteNode(schema, req.params.level, parseInt(req.params.id));
                return new Response(200, {}, { deleted });
            }));

            this.post("/specs/:level/:id/rels", safeHandler((schema, req) => {
                const { relNodeId, relNodeLevel, relType } = JSON.parse(req.requestBody);
                const updated = specService.addNodeRelById(
                    schema,
                    req.params.level,
                    parseInt(req.params.id),
                    relNodeLevel,
                    parseInt(relNodeId),
                    relType
                );
                return new Response(200, {}, { node: updated });
            }));

            this.delete("/specs/:level/:id/rels", safeHandler((schema, req) => {
                const { relNodeId, relNodeLevel, relType } = JSON.parse(req.requestBody);
                const updated = specService.delNodeRel(
                    schema,
                    req.params.level,
                    parseInt(req.params.id),
                    relNodeLevel,
                    parseInt(relNodeId),
                    relType
                );
                return new Response(200, {}, { node: updated });
            }));
        },
    });
};