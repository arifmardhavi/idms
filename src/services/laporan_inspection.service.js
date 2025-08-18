import { apiGet, apiPost, apiDelete } from "./config";

const endpoint = "laporan_inspection";

export const getLaporanInspection = async () => await apiGet(endpoint);
export const getLaporanInspectionById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addLaporanInspection = async (data) => await apiPost(endpoint, data);
export const updateLaporanInspection = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteLaporanInspection = async (id) => await apiDelete(`${endpoint}/${id}`);