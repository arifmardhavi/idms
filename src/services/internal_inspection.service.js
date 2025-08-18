import { apiGet, apiPost, apiDelete } from "./config";

const endpoint = "internal_inspection";

export const getInternalInspection = async () => await apiGet(endpoint);
export const getInternalInspectionById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getInternalInspectionByLaporanInspection = async (id) => await apiGet(`${endpoint}/laporan_inspection/${id}`);
export const addInternalInspection = async (data) => await apiPost(endpoint, data);
export const updateInternalInspection = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteInternalInspection = async (id) => await apiDelete(`${endpoint}/${id}`);