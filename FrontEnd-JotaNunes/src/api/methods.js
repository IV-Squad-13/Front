const ENVIRONMENT = import.meta.env.VITE_CLIENT_ENVIRONMENT || 'CLIENT_TEST';
const API_URL = ENVIRONMENT === 'CLIENT_TEST' ? 'http://localhost:5173/mock/' : import.meta.env.VITE_API_URL;

export const getToApi = async (path, options) => {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {  
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        next: { revalidate: 0 },
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res;
};

export const postToApi = async (path, body) => {
    console.log(API_URL+path);
    const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return res;
};