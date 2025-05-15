import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "amandemen";

export const getAmandemen = async () => await apiGet(endpoint);
export const getAmandemenById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getAmandemenByContract = async (id) => await apiGet(`${endpoint}/contract/${id}`);
export const addAmandemen = async (data) => await apiPost(endpoint, data);
export const updateAmandemen = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteAmandemen = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveAmandemen = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
