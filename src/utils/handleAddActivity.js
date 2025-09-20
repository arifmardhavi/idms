// utils/handleAddActivity.js
import { addOpenFileActivity } from "../services/open_file_activity.service";
import { getAuthUser } from "./auth";

export const handleAddActivity = async (file_name, features) => {
  try {
    const user = getAuthUser();
    if (!user) return;

    const payload = {
      user_id: user.id, // sesuaikan dengan key di JWT (kadang user_id, sub, dsb)
      file_name,
      features,
    };

    await addOpenFileActivity(payload);
  } catch (error) {
    console.error("Error mencatat aktivitas:", error.response?.data || error);
  }
};
