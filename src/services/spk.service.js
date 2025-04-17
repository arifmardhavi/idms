import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "spk";

export const getSpk = async () => await apiGet(endpoint);
export const getSpkById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getSpkByContract = async (id) => await apiGet(`${endpoint}/contract/${id}`);
export const addSpk = async (data) => await apiPost(endpoint, data);
export const updateSpk = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteSpk = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveSpk = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
