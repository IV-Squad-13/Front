const ENVIRONMENT = import.meta.env.VITE_CLIENT_ENVIRONMENT || 'TEST_CLIENT';
const API_URL = ENVIRONMENT === 'TEST_CLIENT' ? 'http://localhost:5173/mock/' : import.meta.env.VITE_API_URL;

export const getToApi = async (path, options) => {
    try {
        const res = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error('Error fetching API:', error);
        throw error;
    }
};

export const postToApi = async (path, body) => {
    console.log(body);
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