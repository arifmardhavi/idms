import { apiGet, apiPost, apiDelete, apiPostProgress } from "./config";

const endpoint = "lampiran_memo";

export const getLampiran = async () => await apiGet(endpoint);
export const getLampiranById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addLampiran = async (data, onUploadProgress) => await apiPostProgress(endpoint, data, onUploadProgress);
export const updateLampiran = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteLampiran = async (id) => await apiDelete(`${endpoint}/${id}`);
export const getLampiranByHistorical = async (id) => await apiGet(`historical_memorandum/lampiran/${id}`);
export const downloadSelectedLampiran = async (selectedIds) => {
    try {
        const response = await apiPost(`${endpoint}/download`, { ids: selectedIds });
        const url = response?.url;
        if (!url) {
            alert("Gagal mendapatkan URL untuk file ZIP.");
            return;
        }
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file_lampiran_memo.zip");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(error);
        alert("Gagal mendownload file Lampiran Memorandum.");
    }
};