import { Response } from "miragejs";

const makeResponse = (status, data = {}, error = null) => {
    return new Response(status, {}, error ? { error } : data);
};

const getAllUsers = (schema) => {
    const users = schema.users.all().models.map(u => {
        const { password, ...safeUser } = u.attrs;
        return safeUser;
    });
    return makeResponse(200, { users });
};

const loginUser = (schema, req) => {
    const { email, password } = JSON.parse(req.requestBody);
    const user = schema.users.findBy({ email, password });

    if (!user) {
        return makeResponse(401, null, "Email ou Senha inválidos");
    }

    const { password: _, ...safeUser } = user.attrs;
    return makeResponse(200, { user: safeUser });
};

const createUser = (schema, req) => {
    const { email, password, ...rest } = JSON.parse(req.requestBody);

    if (!email || !password) {
        return makeResponse(400, null, "Email ou Senha são obrigatórios");
    }

    if (schema.users.findBy({ email })) {
        return makeResponse(409, null, "Usuário já existe");
    }

    const newUser = schema.users.create({ email, password, ...rest });
    const { password: _, ...safeUser } = newUser.attrs;

    return makeResponse(201, { user: safeUser });
};

const updateUser = (schema, req) => {
    const id = req.params.id;
    const userUpdates = JSON.parse(req.requestBody);

    const existingUser = schema.users.find(id);
    if (!existingUser) {
        return makeResponse(404, null, "Usuário não encontrado");
    }

    existingUser.update(userUpdates);

    const { password, ...safeUser } = existingUser.attrs;
    return makeResponse(200, { user: safeUser });
};

export const userService = {
    getAllUsers,
    loginUser,
    createUser,
    updateUser
};