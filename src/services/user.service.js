import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "users";

export const getUser = async () => await apiGet(endpoint);
export const getUserById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addUser = async (data) => await apiPost(endpoint, data);
export const updateUser = async (id, data) => await apiPut(`${endpoint}/${id}`, data);
export const deleteUser = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveUser = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
