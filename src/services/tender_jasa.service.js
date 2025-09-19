import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "tender_jasa";

export const getTenderJasa = async () => await apiGet(endpoint);
export const getTenderJasaById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getTenderJasaByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addTenderJasa = async (data) => await apiPost(endpoint, data);
export const updateTenderJasa = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteTenderJasa = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveTenderJasa = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
