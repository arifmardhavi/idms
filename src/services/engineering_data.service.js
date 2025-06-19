import { apiGet, apiPost, apiDelete } from "./config";

const endpoint = "engineering_data";

export const getEngineeringData = async () => await apiGet(endpoint);
export const getEngineeringDataById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addEngineeringData = async (data) => await apiPost(endpoint, data);
export const updateEngineeringData = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteEngineeringData = async (id) => await apiDelete(`${endpoint}/${id}`);