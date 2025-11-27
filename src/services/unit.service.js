import { 
    apiGet, 
    apiPost, 
    apiPut, 
    apiDelete,
    apiGetBlob,
} from "./config";

const endpoint = "units";

export const getUnit = async () => {
    return await apiGet(endpoint);
};

export const getUnitById = async (id) => {
    return await apiGet(`${endpoint}/${id}`);
};

export const addUnit = async (data) => {
    return await apiPost(endpoint, data);
};

export const updateUnit = async (id, data) => {
    return await apiPut(`${endpoint}/${id}`, data);
};

export const deleteUnit = async (id) => {
    return await apiDelete(`${endpoint}/${id}`);
};

export const ActiveUnit = async () => {
    return await apiGet(`activeunits`);
};
export const ExportUnit = async () => {
    return await apiGetBlob("exportunits");
};

export const nonactiveUnit = async (id) => {
    return await apiPut(`${endpoint}/nonactive/${id}`, {});
};
