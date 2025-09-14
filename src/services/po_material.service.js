import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "po_material";

export const getPoMaterial = async () => await apiGet(endpoint);
export const getPoMaterialById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getPoMaterialByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addPoMaterial = async (data) => await apiPost(endpoint, data);
export const updatePoMaterial = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deletePoMaterial = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactivePoMaterial = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
