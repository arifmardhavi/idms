import { apiGet, apiPost, apiDelete } from "./config";

const endpoint = "onstream_inspection";

export const getOnstreamInspection = async () => await apiGet(endpoint);
export const getOnstreamInspectionById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getOnstreamInspectionByLaporanInspection = async (id) => await apiGet(`${endpoint}/laporan_inspection/${id}`);
export const addOnstreamInspection = async (data) => await apiPost(endpoint, data);
export const updateOnstreamInspection = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteOnstreamInspection = async (id) => await apiDelete(`${endpoint}/${id}`);