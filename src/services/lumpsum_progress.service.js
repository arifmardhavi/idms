import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "lumpsum_progress";

export const getLumpsumProgress = async () => await apiGet(endpoint);
export const getLumpsumProgressById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getLumpsumProgressByContract = async (id) => await apiGet(`${endpoint}/contract/${id}`);
export const addLumpsumProgress = async (data) => await apiPost(endpoint, data);
export const updateLumpsumProgress = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteLumpsumProgress = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveLumpsumProgress = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
