const getAllUsers = (schema) => {
    return new Response(200, {}, { users: schema.users.all() });
};

const loginUser = (schema, email, password) => {
    const user = schema.users.findBy({ email, password });
    if (!user) {
        return new Response(401, {}, { error: "Invalid email or password" });
    }

    return new Response(200, {}, { user: user.attrs });
};

const createUser = (schema, req) => {
    const user = JSON.parse(req.requestBody);

    if (!user.email || !user.password) {
        return new Response(400, {}, { error: "Missing email or password" });
    }

    if (schema.users.findBy({ email: user.email })) {
        return new Response(409, {}, { error: "User already exists" });
    }

    const newUser = schema.users.create(user);
    return new Response(201, {}, { user: newUser.attrs });
};

const updateUser = (schema, req) => {
    const user = JSON.parse(req.requestBody);
    const id = req.params.id;

    if (!user.email || !user.password) {
        return new Response(400, {}, { error: "Missing email or password" });
    }

    const existingUser = schema.users.find(id);
    if (!existingUser) {
        return new Response(404, {}, { error: "User not found" });
    }

    existingUser.update(user);
    return new Response(200, {}, { user: existingUser.attrs });
};