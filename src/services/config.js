// services/api.js
import axios from "axios";

// const API_BASE_URL = "http://ptmksmvmidmsru7.pertamina.com:4444/api/";
const API_BASE_URL = import.meta.env.VITE_BASE_BACKEND_LOCAL_URL;

export const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
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
