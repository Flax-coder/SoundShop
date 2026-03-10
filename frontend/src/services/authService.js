import api from "./api";

export async function loginUser(credentials) {
  const response = await api.post("/api/login", credentials);

  const { token, user } = response.data;

  if (token) {
    localStorage.setItem("token", token);
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return response.data;
}

export async function getMe() {
  const token = localStorage.getItem("token");

  const response = await api.get("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function logoutUser() {
  const token = localStorage.getItem("token");

  await api.post(
    "/api/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getStoredUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}