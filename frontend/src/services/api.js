import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
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

export default api;