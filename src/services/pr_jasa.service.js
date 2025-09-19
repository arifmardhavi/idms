import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "pr_jasa";

export const getPrJasa = async () => await apiGet(endpoint);
export const getPrJasaById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getPrJasaByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addPrJasa = async (data) => await apiPost(endpoint, data);
export const updatePrJasa = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deletePrJasa = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactivePrJasa = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
