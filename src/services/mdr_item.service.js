import { apiGet, apiPost, apiDelete, apiPostProgress } from "./config";

const endpoint = "mdr_item";

export const getMdrItem = async () => await apiGet(endpoint);
export const getMdrItemById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getMdrItemByFolder = async (id) => await apiGet(`${endpoint}/folder/${id}`);
export const addMdrItem = async (data, onUploadProgress) => await apiPostProgress(endpoint, data, onUploadProgress);
export const updateMdrItem = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteMdrItem = async (id) => await apiDelete(`${endpoint}/${id}`);