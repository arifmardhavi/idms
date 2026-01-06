import { apiGet, apiPost, apiDelete, apiPostProgress } from "./config";

const endpoint = "izin_usaha";

export const getIzinUsaha = async () => await apiGet(endpoint);
export const getIzinUsahaById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addIzinUsaha = async (data, onUploadProgress) => await apiPostProgress(endpoint, data, onUploadProgress);
export const updateIzinUsaha = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteIzinUsaha = async (id) => await apiDelete(`${endpoint}/${id}`);