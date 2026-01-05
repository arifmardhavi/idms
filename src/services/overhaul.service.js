import { apiGet, apiPost, apiDelete } from "./config";

const endpoint = "overhaul";

export const getOverhaul = async () => await apiGet(endpoint);
export const getOverhaulById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getOverhaulByLaporanInspection = async (id) => await apiGet(`${endpoint}/laporan_inspection/${id}`);
export const addOverhaul = async (data) => await apiPost(endpoint, data);
export const updateOverhaul = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteOverhaul = async (id) => await apiDelete(`${endpoint}/${id}`);