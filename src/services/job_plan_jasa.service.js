import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "job_plan_jasa";

export const getJobPlanJasa = async () => await apiGet(endpoint);
export const getJobPlanJasaById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getJobPlanJasaByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addJobPlanJasa = async (data) => await apiPost(endpoint, data);
export const updateJobPlanJasa = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteJobPlanJasa = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveJobPlanJasa = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
