import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "types";

export const getType = async () => await apiGet(endpoint);
export const getTypeById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getTypeByCategory = async (id) => await apiGet(`${endpoint}/category/${id}`);
export const addType = async (data) => await apiPost(endpoint, data);
export const updateType = async (id, data) => await apiPut(`${endpoint}/${id}`, data);
export const deleteType = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveType = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
