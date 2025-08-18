import { 
    apiGet,
} from "./config";

const endpoint = "log_activities";

export const getLogActivities = async () => await apiGet(endpoint);
export const getLogActivitiesByAllUsers = async () => await apiGet(`${endpoint}/user`);
export const getLogActivitiesByUserId = async (id) => await apiGet(`${endpoint}/user/${id}`);
