import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "moc";

export const getMoc = async () => await apiGet(endpoint);
export const getMocById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addMoc = async (data) => await apiPost(endpoint, data);
export const updateMoc = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteMoc = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveMoc = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
