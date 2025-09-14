import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "delivery_material";

export const getDeliveryMaterial = async () => await apiGet(endpoint);
export const getDeliveryMaterialById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getDeliveryMaterialByReadiness = async (id) => await apiGet(`${endpoint}/readiness/${id}`);
export const addDeliveryMaterial = async (data) => await apiPost(endpoint, data);
export const updateDeliveryMaterial = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteDeliveryMaterial = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveDeliveryMaterial = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
