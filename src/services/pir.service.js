import { apiGet, apiPost, apiDelete, apiPostProgress } from "./config";

const endpoint = "pir";

export const getPir = async () => await apiGet(endpoint);
export const getPirById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addPir = async (data, onUploadProgress) => await apiPostProgress(endpoint, data, onUploadProgress);
export const updatePir = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deletePir = async (id) => await apiDelete(`${endpoint}/${id}`);