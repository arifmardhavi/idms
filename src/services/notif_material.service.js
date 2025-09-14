import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "notif_material";

export const getNotifMaterial = async () => await apiGet(endpoint);
export const getNotifMaterialById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getNotifMaterialByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addNotifMaterial = async (data) => await apiPost(endpoint, data);
export const updateNotifMaterial = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteNotifMaterial = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveNotifMaterial = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
