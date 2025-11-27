import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "historical_memorandum";

export const getHistoricalMemorandum = async () => await apiGet(endpoint);
export const getHistoricalMemorandumById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addHistoricalMemorandum = async (data) => await apiPost(endpoint, data);
export const updateHistoricalMemorandum = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteHistoricalMemorandum = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveHistoricalMemorandum = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});

export const downloadSelectedHistoricalMemorandum = async (selectedIds) => {
    try {
        const response = await apiPost(`${endpoint}/download`, { ids: selectedIds });
        const url = response?.url;
        if (!url) {
            alert("Gagal mendapatkan URL untuk file ZIP.");
            return;
        }
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file_historical_memorandum.zip");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(error);
        alert("Gagal mendownload file Historical Memorandum.");
    }
};