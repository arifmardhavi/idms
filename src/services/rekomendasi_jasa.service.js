import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "rekomendasi_jasa";

export const getRekomendasiJasa = async () => await apiGet(endpoint);
export const getRekomendasiJasaById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getRekomendasiJasaByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addRekomendasiJasa = async (data) => await apiPost(endpoint, data);
export const updateRekomendasiJasa = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteRekomendasiJasa = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveRekomendasiJasa = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
