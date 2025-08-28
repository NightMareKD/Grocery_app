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

export { ApiError };