import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "notif_jasa";

export const getNotifJasa = async () => await apiGet(endpoint);
export const getNotifJasaById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getNotifJasaByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addNotifJasa = async (data) => await apiPost(endpoint, data);
export const updateNotifJasa = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteNotifJasa = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveNotifJasa = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
