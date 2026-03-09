const API_URL = "http://127.0.0.1:8000/api";

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  return response.json();
};