import { apiGet, apiPost, apiDelete } from "./config";

const endpoint = "report_coi";

export const getReport = async () => await apiGet(endpoint);
export const getReportById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addReport = async (data) => await apiPost(endpoint, data);
export const updateReport = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteReport = async (id) => await apiDelete(`${endpoint}/${id}`);
export const getReportByCoi = async (id) => await apiGet(`report_cois/${id}`);