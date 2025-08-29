import { createServer, Model, Response } from "miragejs";

export const makeServer = () => {
    return createServer({
        models: {
            user: Model,
        },

        seeds(server) {
            const users = [
                { id: 1, name: "John Doe", email: "admin@admin.com", password: "123" },
                { id: 2, name: "Jane Doe", email: "admin@admin.com", password: "123" },
            ];
            users.forEach((u) => server.create("user", u));
        },

        routes() {
            this.namespace = "mock";

            this.get("/users", (schema) => {
                return getAllUsers(schema);
            });

            this.get("/user/login", (schema, req) => {
                const { email, password } = req.queryParams;
                return loginUser(schema, email, password);
            });

            this.post("/user", (schema, req) => {
                return createUser(schema, req);
            });

            this.put("/user/:id", (schema, req) => {
                return updateUser(schema, req);
            });
        },
    });
};