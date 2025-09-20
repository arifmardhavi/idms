// utils/auth.js
import { jwtDecode } from "jwt-decode";

export const getAuthUser = () => {
  try {
    const token = localStorage.getItem("token"); // atau sessionStorage
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded; // decode token jwt
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
