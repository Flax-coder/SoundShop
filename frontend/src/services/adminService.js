import api from "./api";

const API_URL = "http://127.0.0.1:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

export const getAdminUsers = async () => {
  const response = await api.get(`${API_URL}/admin/users`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const toggleAdminUser = async (userId) => {
  const response = await api.patch(
    `${API_URL}/admin/users/${userId}/toggle-admin`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`${API_URL}/admin/users/${userId}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};