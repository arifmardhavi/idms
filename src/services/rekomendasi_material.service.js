import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "rekomendasi_material";

export const getRekomendasiMaterial = async () => await apiGet(endpoint);
export const getRekomendasiMaterialById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getRekomendasiMaterialByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addRekomendasiMaterial = async (data) => await apiPost(endpoint, data);
export const updateRekomendasiMaterial = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteRekomendasiMaterial = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveRekomendasiMaterial = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
