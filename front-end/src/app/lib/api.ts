const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

type RequestOptions = RequestInit & {
  token?: string;
};

const request = async <T = unknown>(path: string, options: RequestOptions = {}): Promise<T> => {
  const token = options.token || localStorage.getItem('milstock_token');
  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'API request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

function crud(basePath: string) {
  return {
    list: () => request(basePath),
    get: (id: string) => request(`${basePath}/${id}`),
    create: (payload: unknown) =>
      request(basePath, { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: unknown) =>
      request(`${basePath}/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    remove: (id: string) => request(`${basePath}/${id}`, { method: 'DELETE' }),
  };
}

export const api = {
  auth: {
    register: (payload: unknown) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload: unknown) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    me: () => request('/auth/me'),
  },
  users: crud('/users'),
  products: crud('/products'),
  warehouses: crud('/warehouses'),
  suppliers: crud('/suppliers'),
  orders: crud('/orders'),
  orderItems: crud('/order-items'),
  inventory: crud('/inventory'),
  productWarehouses: crud('/product-warehouses'),
  consumption: crud('/consumption'),
  notifications: crud('/notifications'),
};
