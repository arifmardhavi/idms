import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "izin_operasi";

export const getIzinOperasi = async () => await apiGet(endpoint);
export const getIzinOperasiById = async (id) => await apiGet(`${endpoint}/${id}`);

export const addIzinOperasi = async (data) => await apiPost(endpoint, data);

export const updateIzinOperasi = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);

export const deleteIzinOperasi = async (id) => await apiDelete(`${endpoint}/${id}`);

export const nonactiveIzinOperasi = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});

export const deleteIzinOperasiFile = async (id, data) => await apiPut(`${endpoint}/deletefile/${id}`, data);

export const izinOperasiCountDueDays = async () => await apiGet("izin_operasi_countduedays");

export const downloadSelectedIzinOperasi = async (selectedIds) => {
  try {
    const response = await apiPost(`${endpoint}/download`, {
      ids: selectedIds,
    });

    const url = response?.url;
    if (!url) {
      alert("Gagal mendapatkan URL untuk file ZIP.");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      "izin_operasi_certificates.zip"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
    alert("Gagal mendownload file Izin Operasi.");
  }
};