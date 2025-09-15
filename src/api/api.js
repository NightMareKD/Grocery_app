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

let shoppingLists = [
  {
    id: 1,
    name: 'Today',
    items: [
      { id: 101, name: 'Milk', quantity: 2, checked: false },
      { id: 102, name: 'Tea', quantity: 1, checked: false }
    ]
  },
  {
    id: 2,
    name: 'Tomorrow',
    items: [
      { id: 201, name: 'Rice', quantity: 1, checked: false },
      { id: 202, name: 'Beans', quantity: 1, checked: false },
      { id: 203, name: 'Pasta', quantity: 1, checked: false },
      { id: 204, name: 'Ketchup', quantity: 1, checked: false }
    ]
  }
];

export const shoppingApi = {
  getLists: async () => {
    return new Promise(resolve => setTimeout(() => resolve([...shoppingLists]), 300));
  },
  createList: async (name) => {
    const newList = { id: Date.now(), name, items: [] };
    shoppingLists.push(newList);
    return new Promise(resolve => setTimeout(() => resolve(newList), 300));
  },
  addItem: async (listId, item) => {
    const list = shoppingLists.find(l => l.id === listId);
    if (!list) throw new Error('List not found');
    const newItem = { ...item, id: Date.now(), checked: false };
    list.items.push(newItem);
    return new Promise(resolve => setTimeout(() => resolve(newItem), 300));
  },
  updateItem: async (listId, itemId, updates) => {
    const list = shoppingLists.find(l => l.id === listId);
    if (!list) throw new Error('List not found');
    list.items = list.items.map(i => i.id === itemId ? { ...i, ...updates } : i);
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  },
  deleteItem: async (listId, itemId) => {
    const list = shoppingLists.find(l => l.id === listId);
    if (!list) throw new Error('List not found');
    list.items = list.items.filter(i => i.id !== itemId);
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
};

export { ApiError };