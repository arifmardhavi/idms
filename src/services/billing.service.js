import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "termbilling";

export const getTermBilling = async () => await apiGet(endpoint);
export const getTermBillingById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getTermBillingByContract = async (id) => await apiGet(`${endpoint}/contract/${id}`);
export const addTermBilling = async (data) => await apiPost(endpoint, data);
export const updateTermBilling = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteTermBilling = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveTermBilling = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
