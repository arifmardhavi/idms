import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "termin";

export const getTermin = async () => await apiGet(endpoint);
export const getTerminById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getTerminByContract = async (id) => await apiGet(`${endpoint}/contract/${id}`);
export const addTermin = async (data) => await apiPost(endpoint, data);
export const updateTermin = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteTermin = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveTermin = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
