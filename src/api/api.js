const API_BASE = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || 'An error occurred',
      response.status,
      errorData
    );
  }

  if (response.status === 204) {
    return null; // No content
  }

  return response.json();
}



export const pantryApi = {
  // Get all pantry items
  async getAll() {
    const response = await fetch(`${API_BASE}/pantry`);
    return handleResponse(response);
  },

  // Get single pantry item
  async getById(id) {
    const response = await fetch(`${API_BASE}/pantry/${id}`);
    return handleResponse(response);
  },

  // Create new pantry item
  async create(item) {
    const response = await fetch(`${API_BASE}/pantry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    return handleResponse(response);
  },

  // Update pantry item
  async update(id, updates) {
    const response = await fetch(`${API_BASE}/pantry/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  // Delete pantry item
  async delete(id) {
    const response = await fetch(`${API_BASE}/pantry/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE}/health`);
    return handleResponse(response);
  }
};

let shoppingItems = [
  { id: 1, name: 'Milk', quantity: 2 },
  { id: 2, name: 'Bread', quantity: 1 }
];

export const shoppingApi = {
  getAll: async () => {
    // Simulate async
    return new Promise(resolve => setTimeout(() => resolve([...shoppingItems]), 300));
  },
  create: async (item) => {
    const newItem = { ...item, id: Date.now() };
    shoppingItems.push(newItem);
    return new Promise(resolve => setTimeout(() => resolve(newItem), 300));
  },
  update: async (id, item) => {
    shoppingItems = shoppingItems.map(i => i.id === id ? { ...i, ...item } : i);
    return new Promise(resolve => setTimeout(() => resolve({ ...item, id }), 300));
  },
  delete: async (id) => {
    shoppingItems = shoppingItems.filter(i => i.id !== id);
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
};

export { ApiError };