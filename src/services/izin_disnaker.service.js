import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "izin_disnaker";

export const getIzinDisnaker = async () => await apiGet(endpoint);
export const getIzinDisnakerById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getIzinDisnakerByTagNumber = async (id) => await apiGet(`${endpoint}/tag_number/${id}`);
export const addIzinDisnaker = async (data) => await apiPost(endpoint, data);
export const updateIzinDisnaker = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteIzinDisnaker = async (id) => await apiDelete(`${endpoint}/${id}`);
export const deleteIzinDisnakerFile = async (id, data) => await apiPut(`${endpoint}/deletefile/${id}`, data);
export const izinDisnakerCountDueDays = async () => await apiGet("izin_disnaker_countduedays");

export const downloadSelectedIzinDisnaker = async (selectedIds) => {
    try {
        const response = await apiPost(`${endpoint}/download`, { ids: selectedIds });
        const url = response?.url;
        if (!url) {
            alert("Gagal mendapatkan URL untuk file ZIP.");
            return;
        }
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "izin_disnaker_certificates.zip");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(error);
        alert("Gagal mendownload file Izin Disnaker.");
    }
};