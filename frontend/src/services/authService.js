import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
  },
});

export const getCsrfCookie = async () => {
  return await api.get("/sanctum/csrf-cookie");
};

export const loginRequest = async (email, password) => {
  return await api.post("/api/login", { email, password });
};

export const meRequest = async () => {
  return await api.get("/api/me");
};

export const logoutRequest = async () => {
  return await api.post("/api/logout");
};

export default api;