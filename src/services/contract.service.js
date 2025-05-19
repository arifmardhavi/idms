import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "contract";

export const getContract = async () => await apiGet(endpoint);
export const getContractById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addContract = async (data) => await apiPost(endpoint, data);
export const updateContract = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteContract = async (id) => await apiDelete(`${endpoint}/${id}`);
export const deleteContractFile = async (id, data) => await apiPut(`${endpoint}/deletefile/${id}`, data);
export const getMonitoringContract = async () => await apiGet('monitoring_contract');