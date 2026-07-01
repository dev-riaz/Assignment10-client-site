import { baseUrl } from "./baseUrl";

export const serverMutation = async (path, method, data) => {
    const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    try {
        return await res.json();
    } catch {
        return { success: false, message: `Unexpected response (status ${res.status})` };
    }
};

export const serverFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`);

    try {
        return await res.json();
    } catch {
        return { success: false, message: `Unexpected response (status ${res.status})` };
    }
};