import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "readiness_jasa";

export const getReadinessJasa = async () => await apiGet(endpoint);
export const getReadinessJasaById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getReadinessJasaByEvent = async (id) => await apiGet(`${endpoint}/event/${id}`);
export const addReadinessJasa = async (data) => await apiPost(endpoint, data);
export const updateReadinessJasa = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteReadinessJasa = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveReadinessJasa = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
export const getDashboardReadinessJasaByEvent = async (id) => await apiGet(`${endpoint}/dashboard/${id}`);
