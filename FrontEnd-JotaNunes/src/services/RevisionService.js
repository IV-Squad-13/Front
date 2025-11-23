import { API_URL } from "@/main";
import { authFetch } from "./AuthService";

export const getRevisionByEmpId = async (empId) => {
    const queryParams = new URLSearchParams({ loadRevDocuments: true }).toString();
    return await authFetch(`${API_URL}/revision/emp/${empId}?${queryParams}`)
}

export const requestRevision = async (id, data) => {
    return await authFetch(`${API_URL}/revision/${id}/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export const sendRevision = async (id, resolution) => {
    const validResolutions = ["approve", "reject"];
    if (!validResolutions.includes(resolution)) return null;
    return await authFetch(`${API_URL}/revision/${id}/${resolution}`, {
        method: 'POST'
    });
}

export const startRevision = async (id, revisorId, params = {}) => {
    const query = new URLSearchParams({ revisorId, ...params }).toString();
    return await authFetch(`${API_URL}/revision/${id}/start?${query}`, {
        method: "POST",
    });
};


export const updateRevisionDoc = async (id, data) => {
    return await authFetch(`${API_URL}/revision/doc/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}