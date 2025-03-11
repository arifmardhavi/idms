import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "plo";

export const getPlo = async () => await apiGet(endpoint);
export const getPloById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addPlo = async (data) => await apiPost(endpoint, data);
export const updatePlo = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deletePlo = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactivePlo = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
export const deletePloFile = async (id, data) => await apiPut(`${endpoint}/deletefile/${id}`, data);
export const ploCountDueDays = async () => await apiGet("plo_countduedays");

export const downloadSelectedPlo = async (selectedIds) => {
    try {
        const response = await apiPost(`${endpoint}/download`, { ids: selectedIds });
        const url = response?.url;
        if (!url) {
            alert("Gagal mendapatkan URL untuk file ZIP.");
            return;
        }
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "plo_certificates.zip");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(error);
        alert("Gagal mendownload file PLO.");
    }
};
