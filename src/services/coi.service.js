import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "coi";

export const getCoi = async () => await apiGet(endpoint);
export const getCoiById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addCoi = async (data) => await apiPost(endpoint, data);
export const updateCoi = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteCoi = async (id) => await apiDelete(`${endpoint}/${id}`);
export const deleteCoiFile = async (id, data) => await apiPut(`${endpoint}/deletefile/${id}`, data);
export const coiCountDueDays = async () => await apiGet("coi_countduedays");

export const downloadSelectedCoi = async (selectedIds) => {
    try {
        const response = await apiPost(`${endpoint}/download`, { ids: selectedIds });
        const url = response?.url;
        if (!url) {
            alert("Gagal mendapatkan URL untuk file ZIP.");
            return;
        }
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "coi_certificates.zip");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(error);
        alert("Gagal mendownload file COI.");
    }
};
