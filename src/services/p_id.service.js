import { apiGet, apiPost, apiDelete, apiPostProgress } from "./config";

const endpoint = "p_id";

export const getP_id = async () => await apiGet(endpoint);
export const getP_idById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addP_id = async (data, onUploadProgress) => await apiPostProgress(endpoint, data, onUploadProgress);
export const updateP_id = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteP_id = async (id) => await apiDelete(`${endpoint}/${id}`);