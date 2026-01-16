import { apiGet, apiPost, apiDelete } from "./config";

const endpoint = "mdr_folder";

export const getMdrFolder = async () => await apiGet(endpoint);
export const getMdrFolderById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getMdrFolderByEngineering = async (id) => await apiGet(`${endpoint}/engineering/${id}`);
export const addMdrFolder = async (data) => await apiPost(endpoint, data);
export const updateMdrFolder = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteMdrFolder = async (id) => await apiDelete(`${endpoint}/${id}`);