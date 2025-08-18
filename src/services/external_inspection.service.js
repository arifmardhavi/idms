import { apiGet, apiPost, apiDelete } from "./config";

const endpoint = "external_inspection";

export const getExternalInspection = async () => await apiGet(endpoint);
export const getExternalInspectionById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getExternalInspectionByLaporanInspection = async (id) => await apiGet(`${endpoint}/laporan_inspection/${id}`);
export const addExternalInspection = async (data) => await apiPost(endpoint, data);
export const updateExternalInspection = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteExternalInspection = async (id) => await apiDelete(`${endpoint}/${id}`);