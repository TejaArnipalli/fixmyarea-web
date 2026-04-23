import axios from "axios";

const API = axios.create({
  // This looks for a variable in your .env file; defaults to localhost if not found
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    // This tells Localtunnel to skip the "Friendly Reminder" warning page
    "Bypass-Tunnel-Reminder": "true",
  },
});

// Add interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;