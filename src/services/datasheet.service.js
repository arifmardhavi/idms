import { apiGet, apiPost, apiDelete, apiPostProgress } from "./config";

const endpoint = "datasheet";

export const getDatasheet = async () => await apiGet(endpoint);
export const getDatasheetByEngineering = async (id) => await apiGet(`${endpoint}/engineering/${id}`);
export const getDatasheetById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addDatasheet = async (data, onUploadProgress) => await apiPostProgress(endpoint, data, onUploadProgress);
export const updateDatasheet = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteDatasheet = async (id) => await apiDelete(`${endpoint}/${id}`);