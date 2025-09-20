import { 
    apiDelete,
    apiGet,
    apiPost,
} from "./config";

const endpoint = "open_file_activity";

export const getOpenFileActivity = async () => await apiGet(endpoint);
export const getOpenFileActivityByUserId = async (id) => await apiGet(`${endpoint}/user/${id}`);
export const getOpenFileActivityById = async (id) => await apiGet(`${endpoint}/${id}`);
export const addOpenFileActivity = async (data) => await apiPost(endpoint, data);
export const updateOpenFileActivity = async (id, data) => await apiPost(`${endpoint}/${id}?_method=PUT`, data);
export const deleteOpenFileActivity = async (id) => await apiDelete(`${endpoint}/${id}`);
