import { apiGet, apiPost, apiDelete } from "./config";

const endpoint = "surveillance";

export const getSurveillance = async () => await apiGet(endpoint);
export const getSurveillanceById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getSurveillanceByLaporanInspection = async (id) => await apiGet(`${endpoint}/laporan_inspection/${id}`);
export const addSurveillance = async (data) => await apiPost(endpoint, data);
export const updateSurveillance = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteSurveillance = async (id) => await apiDelete(`${endpoint}/${id}`);