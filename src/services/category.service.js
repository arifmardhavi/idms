import { 
    apiGet, 
    apiPost, 
    apiPut, 
    apiDelete, 
} from "./config";

export const getCategory = async () => {
    return await apiGet("categories");
};

export const getCategoryById = async (id) => {
    return await apiGet(`categories/${id}`);
};

export const getCategoryByUnit = async (id) => {
    return await apiGet(`categories/unit/${id}`);
};

export const addCategory = async (data) => {
    return await apiPost("categories", data);
};

export const updateCategory = async (id, data) => {
    return await apiPut(`categories/${id}`, data);
};

export const deleteCategory = async (id) => {
    return await apiDelete(`categories/${id}`);
};

export const nonactiveCategory = async (id) => {
    return await apiPut(`categories/nonactive/${id}`, {});
};