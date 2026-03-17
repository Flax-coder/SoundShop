import api from "./api";

export async function loginUser(credentials) {
  const response = await api.post("/api/login", credentials);

  const { token, user } = response.data;

  if (token) {
    sessionStorage.setItem("token", token);
  }

  if (user) {
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  return response.data;
}

export async function getMe() {
  const response = await api.get("/api/me");
  return response.data;
}

export async function logoutUser() {
  try {
    await api.post("/api/logout");
  } catch (e) {
    console.warn("Logout API failed, forcing client logout");
  }

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}

export function getStoredUser() {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getStoredToken() {
  return sessionStorage.getItem("token");
}

export function isAuthenticated() {
  return !!sessionStorage.getItem("token");
}