import { apiGet } from "./config";

const endpoint = "historical_equipment";

export const getHistoricalEquipment = async () => await apiGet(endpoint);
