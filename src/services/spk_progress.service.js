import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "spk_progress";

export const getSpkProgress = async () => await apiGet(endpoint);
export const getSpkProgressById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getSpkProgressByContract = async (id) => await apiGet(`${endpoint}/contract/${id}`);
export const addSpkProgress = async (data) => await apiPost(endpoint, data);
export const updateSpkProgress = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteSpkProgress = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveSpkProgress = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
