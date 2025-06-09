import { apiGet, apiPost, apiPut, apiDelete } from "./config";

const endpoint = "tagnumbers";

export const getTagnumber = async () => await apiGet(endpoint);
export const getTagnumberById = async (id) => await apiGet(`${endpoint}/${id}`);
export const getTagnumberByType = async (id) => await apiGet(`${endpoint}/type/${id}`);
export const getTagnumberByTagnumberId = async (id) => await apiGet(`${endpoint}/tag_number/${id}`);
export const getTagnumberByTagnumber = async (tagname) => await apiGet(`tagname`, { tag_number: tagname });
export const getTagnumberByTypeUnit = async (typeId, unitId) => await apiGet(`${endpoint}/typeunit/${typeId}/${unitId}`);
export const getTagnumberByUnit = async (unitId) => await apiGet(`${endpoint}/unit/${unitId}`);
export const addTagnumber = async (data) => await apiPost(endpoint, data);
export const updateTagnumber = async (id, data) => await apiPut(`${endpoint}/${id}`, data);
export const deleteTagnumber = async (id) => await apiDelete(`${endpoint}/${id}`);
export const nonactiveTagnumber = async (id) => await apiPut(`${endpoint}/nonactive/${id}`, {});
