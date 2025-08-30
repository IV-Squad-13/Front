import { getToApi, postToApi } from "./methods";

export const fetchUsers = async () => {
    try {
        return await getToApi('user');
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        return await postToApi('user/login', { email, password });
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};