import { jwtDecode } from "jwt-decode";

export const getUsernameFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    // ⚠️ depends on your JWT payload
    return decoded.username;
  } catch (err) {
    return null;
  }
};