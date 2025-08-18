// services/api.js
import axios from "axios";

const mode = 'local'; // 'local' or 'server'
// const mode = 'server'; // 'local' or 'server'
const base_server = import.meta.env.VITE_BASE_BACKEND_SERVER_URL;
const public_server = import.meta.env.VITE_PUBLIC_BACKEND_SERVER_URL;
const base_local = import.meta.env.VITE_BASE_BACKEND_LOCAL_URL;
const public_local = import.meta.env.VITE_PUBLIC_BACKEND_LOCAL_URL;
const API_BASE_URL = mode === 'server' ? base_server : base_local;
export const api_public = mode === 'server' ? public_server : public_local;

export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Auth token tidak ditemukan!");
        return null;
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Helper untuk request POST tanpa autentikasi (contoh untuk login)
export const apiPostPublic = async (endpoint, data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
        console.log("POST Public Response:", data);
        return response.data;
    } catch (error) {
        console.error("POST Public Error:", error);
        throw error;
    }
};


// Helper untuk request GET
export const apiGet = async (endpoint) => {
    try {
        const config = getAuthHeaders();
        if (!config) return;

        const response = await axios.get(`${API_BASE_URL}${endpoint}`, config);
        return response.data;
    } catch (error) {
        console.error("GET Error:", error);
        throw error;
    }
};

export const apiLogout = async (endpoint, token) => {
    try {
        const config = getAuthHeaders();
        if (!config) return;

        const response = await axios.post(`${API_BASE_URL}${endpoint}?token=${token}`, config);
        console.log(response.data.message);
        return response.data.message;
    } catch (error) {
        console.error("POST Error:", error);
        throw error;
    }
};

// Helper untuk request POST
export const apiPost = async (endpoint, data) => {
    try {
        const config = getAuthHeaders();
        if (!config) return;

        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, config);
        return response.data;
    } catch (error) {
        console.error("POST Error:", error);
        throw error;
    }
};

export const apiPostProgress = async (endpoint, data, onUploadProgress) => {
    try {
        const headers = getAuthHeaders();
        if (!headers) return;

        const config = {
            ...headers,
            onUploadProgress, // <- tambahkan ini ke dalam config
        };

        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, config);
        return response.data;
    } catch (error) {
        console.error("POST Error:", error);
        throw error;
    }
};

// Helper untuk request PUT
export const apiPut = async (endpoint, data) => {
    try {
        const config = getAuthHeaders();
        if (!config) return;

        const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, config);
        return response.data;
    } catch (error) {
        console.error("PUT Error:", error);
        throw error;
    }
};

// Helper untuk request DELETE
export const apiDelete = async (endpoint) => {
    try {
        const config = getAuthHeaders();
        if (!config) return;

        const response = await axios.delete(`${API_BASE_URL}${endpoint}`, config);
        return response.data;
    } catch (error) {
        console.error("DELETE Error:", error);
        throw error;
    }
};
