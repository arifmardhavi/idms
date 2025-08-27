import { apiGet, apiPost, apiDelete } from "./config";

const endpoint = "breakdown_report";

export const getBreakdownReport = async () => await apiGet(endpoint);
export const getBreakdownReportById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getBreakdownReportByLaporanInspection = async (id) => await apiGet(`${endpoint}/laporan_inspection/${id}`);
export const addBreakdownReport = async (data) => await apiPost(endpoint, data);
export const updateBreakdownReport = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteBreakdownReport = async (id) => await apiDelete(`${endpoint}/${id}`);