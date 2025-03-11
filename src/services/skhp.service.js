import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "skhp";

export const getSkhp = async () => await apiGet(endpoint);
export const getSkhpById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addSkhp = async (data) => await apiPost(endpoint, data);
export const updateSkhp = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteSkhp = async (id) => await apiDelete(`${endpoint}/${id}`);
export const deleteSkhpFile = async (id, data) => await apiPut(`${endpoint}/deletefile/${id}`, data);
export const skhpCountDueDays = async () => await apiGet("skhp_countduedays");

export const downloadSelectedSkhp = async (selectedIds) => {
    try {
        const response = await apiPost(`${endpoint}/download`, { ids: selectedIds });
        const url = response?.url;
        if (!url) {
            alert("Gagal mendapatkan URL untuk file ZIP.");
            return;
        }
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file_skhp.zip");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(error);
        alert("Gagal mendownload file SKHP.");
    }
};