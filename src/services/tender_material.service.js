import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "tender_material";

export const getTenderMaterial = async () => await apiGet(endpoint);
export const getTenderMaterialById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getTenderMaterialByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addTenderMaterial = async (data) => await apiPost(endpoint, data);
export const updateTenderMaterial = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteTenderMaterial = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveTenderMaterial = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
