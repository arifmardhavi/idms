import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "historical_memorandum";

export const getHistoricalMemorandum = async () => await apiGet(endpoint);
export const getHistoricalMemorandumById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addHistoricalMemorandum = async (data) => await apiPost(endpoint, data);
export const updateHistoricalMemorandum = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteHistoricalMemorandum = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveHistoricalMemorandum = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
