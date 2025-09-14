import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "pr_material";

export const getPrMaterial = async () => await apiGet(endpoint);
export const getPrMaterialById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getPrMaterialByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addPrMaterial = async (data) => await apiPost(endpoint, data);
export const updatePrMaterial = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deletePrMaterial = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactivePrMaterial = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
