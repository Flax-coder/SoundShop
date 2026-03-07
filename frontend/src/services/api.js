const API_BASE = "http://127.0.0.1:8000/api";

export async function getTest() {
  const response = await fetch(`${API_BASE}/test`);
  return response.json();
}

export async function getProducts() {
  const response = await fetch(`${API_BASE}/products`);

  if (!response.ok) {
    throw new Error(`Errore HTTP: ${response.status}`);
  }

  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`${API_BASE}/products/${id}`);

  if (!response.ok) {
    throw new Error(`Errore HTTP: ${response.status}`);
  }

  return response.json();
}