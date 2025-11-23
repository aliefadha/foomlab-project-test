const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getPurchaseRequests() {
  const response = await fetch(`${API_URL}/purchase/request`);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Failed to fetch purchase requests');
    error.response = data;
    throw error;
  }
  return data;
}

export async function createPurchaseRequest(data) {
  const response = await fetch(`${API_URL}/purchase/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();

  if (!response.ok) {
    const error = new Error(responseData.message || 'Failed to create purchase request');
    error.response = responseData;
    throw error;
  }
  return responseData;
}

export async function updatePurchaseRequest(id, data) {
  const response = await fetch(`${API_URL}/purchase/request/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();

  if (!response.ok) {
    const error = new Error(responseData.message || 'Failed to update purchase request');
    error.response = responseData;
    throw error;
  }
  return responseData;
}

export async function deletePurchaseRequest(id) {
  const response = await fetch(`${API_URL}/purchase/request/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Failed to delete purchase request');
    error.response = data;
    throw error;
  }
  return data;
}

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Failed to fetch products');
    error.response = data;
    throw error;
  }
  return data;
}

export async function getWarehouses() {
  const response = await fetch(`${API_URL}/warehouses`);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Failed to fetch warehouses');
    error.response = data;
    throw error;
  }
  return data;
}
