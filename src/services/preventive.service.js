import { apiGet, apiPost, apiDelete } from "./config";

const endpoint = "preventive";

export const getPreventive = async () => await apiGet(endpoint);
export const getPreventiveById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getPreventiveByLaporanInspection = async (id) => await apiGet(`${endpoint}/laporan_inspection/${id}`);
export const addPreventive = async (data) => await apiPost(endpoint, data);
export const updatePreventive = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deletePreventive = async (id) => await apiDelete(`${endpoint}/${id}`);