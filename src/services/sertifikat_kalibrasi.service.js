import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "sertifikat_kalibrasi";

export const getSertifikatKalibrasi = async () => await apiGet(endpoint);
export const getSertifikatKalibrasiById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addSertifikatKalibrasi = async (data) => await apiPost(endpoint, data);
export const updateSertifikatKalibrasi = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteSertifikatKalibrasi = async (id) => await apiDelete(`${endpoint}/${id}`);
export const deleteSertifikatKalibrasiFile = async (id, data) => await apiPut(`${endpoint}/deletefile/${id}`, data);
export const SertifikatKalibrasiCountDueDays = async () => await apiGet("sertifikat_kalibrasi_countduedays");

export const downloadSelectedSertifikatKalibrasi = async (selectedIds) => {
    try {
        const response = await apiPost(`${endpoint}/download`, { ids: selectedIds });
        const url = response?.url;
        if (!url) {
            alert("Gagal mendapatkan URL untuk file ZIP.");
            return;
        }
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file_sertifikat_kalibrasi.zip");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error(error);
        alert("Gagal mendownload file Sertifikat Kalibrasi.");
    }
};