import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "job_plan_material";

export const getJobPlanMaterial = async () => await apiGet(endpoint);
export const getJobPlanMaterialById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getJobPlanMaterialByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addJobPlanMaterial = async (data) => await apiPost(endpoint, data);
export const updateJobPlanMaterial = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteJobPlanMaterial = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveJobPlanMaterial = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
