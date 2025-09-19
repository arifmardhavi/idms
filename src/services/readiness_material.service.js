import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "readiness_material";

export const getReadinessMaterial = async () => await apiGet(endpoint);
export const getReadinessMaterialById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getReadinessMaterialByEvent = async (id) => await apiGet(`${endpoint}/event/${id}`);
export const addReadinessMaterial = async (data) => await apiPost(endpoint, data);
export const updateReadinessMaterial = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteReadinessMaterial = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveReadinessMaterial = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
