import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "contract_jasa";

export const getContractJasa = async () => await apiGet(endpoint);
export const getContractJasaById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getContractJasaByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addContractJasa = async (data) => await apiPost(endpoint, data);
export const updateContractJasa = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteContractJasa = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveContractJasa = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
