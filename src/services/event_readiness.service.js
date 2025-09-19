import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "event_readiness";

export const getEventReadiness = async () => await apiGet(endpoint);
export const getEventReadinessById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addEventReadiness = async (data) => await apiPost(endpoint, data);
export const updateEventReadiness = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteEventReadiness = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveEventReadiness = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
