import { apiGet, apiPost, apiDelete, apiPostProgress } from "./config";

const endpoint = "ga_drawing";

export const getGaDrawing = async () => await apiGet(endpoint);
export const getGaDrawingByEngineering = async (id) => await apiGet(`${endpoint}/engineering/${id}`);
export const getGaDrawingById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addGaDrawing = async (data, onUploadProgress) => await apiPostProgress(endpoint, data, onUploadProgress);
export const updateGaDrawing = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteGaDrawing = async (id) => await apiDelete(`${endpoint}/${id}`);