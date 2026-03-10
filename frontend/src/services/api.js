import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

export async function getTest() {
  const response = await api.get("/api/test");
  return response.data;
}

export async function getProducts() {
  const response = await api.get("/api/products");
  return response.data;
}

export async function getProductById(id) {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
}

export async function getCategories() {
  const response = await api.get("/api/categories");
  return response.data;
}

export async function getCsrfCookie() {
  return await api.get("/sanctum/csrf-cookie");
}

export default api;