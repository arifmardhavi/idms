import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "fabrikasi_material";

export const getFabrikasiMaterial = async () => await apiGet(endpoint);
export const getFabrikasiMaterialById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getFabrikasiMaterialByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addFabrikasiMaterial = async (data) => await apiPost(endpoint, data);
export const updateFabrikasiMaterial = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteFabrikasiMaterial = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveFabrikasiMaterial = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
