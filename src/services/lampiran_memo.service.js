import { apiGet, apiPost, apiDelete } from "./config";

const endpoint = "lampiran_memo";

export const getLampiran = async () => await apiGet(endpoint);
export const getLampiranById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addLampiran = async (data) => await apiPost(endpoint, data);
export const updateLampiran = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteLampiran = async (id) => await apiDelete(`${endpoint}/${id}`);
export const getLampiranByHistorical = async (id) => await apiGet(`historical_memorandum/lampiran/${id}`);