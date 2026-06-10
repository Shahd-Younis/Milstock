const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
const DEMO_TOKEN = "frontend-test-admin-token";

const request = async (path, options = {}) => {
  const { token: explicitToken, ...fetchOptions } = options;
  const token = Object.prototype.hasOwnProperty.call(options, "token")
    ? explicitToken
    : localStorage.getItem("milstock_token");
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || "API request failed");
  }
  if (response.status === 204) {
    return void 0;
  }
  return response.json();
};

const ensureBackendAdminToken = async () => {
  const token = localStorage.getItem("milstock_token");
  if (token !== DEMO_TOKEN) return token;

  const response = await request("/auth/login", {
    method: "POST",
    token: "",
    body: JSON.stringify({
      email: "admin@milstock.local",
      password: "Password123!"
    })
  });

  if (response?.token) {
    localStorage.setItem("milstock_token", response.token);
  }
  if (response?.data) {
    localStorage.setItem("milstock_user", JSON.stringify(response.data));
  }

  return response?.token;
};

function crud(basePath) {
  return {
    list: () => request(basePath),
    get: (id) => request(`${basePath}/${id}`),
    create: (payload) => request(basePath, { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => request(`${basePath}/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id) => request(`${basePath}/${id}`, { method: "DELETE" })
  };
}
const api = {
  auth: {
    register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
    login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    me: () => request("/auth/me")
  },
  users: {
    ...crud("/users"),
    create: async (payload) => {
      await ensureBackendAdminToken();
      return request("/users", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    },
    update: (id, payload) => request(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
    updateStatus: (id, status) => request(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),
    resetPassword: (id, password) => request(`/users/${id}/password`, {
      method: "PATCH",
      body: JSON.stringify({ password })
    }),
    remove: (id) => request(`/users/${id}`, { method: "DELETE" })
  },
  products: crud("/products"),
  warehouses: crud("/warehouses"),
  suppliers: crud("/suppliers"),
  orders: {
    ...crud("/orders"),
    updateStatus: (id, status, note) => request(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, note })
    }),
    statusLogs: (id) => request(`/orders/${id}/status-logs`)
  },
  orderItems: crud("/order-items"),
  inventory: crud("/inventory"),
  productWarehouses: crud("/product-warehouses"),
  consumption: crud("/consumption"),
  notifications: {
    ...crud("/notifications"),
    expiration: () => request("/notifications/expiration/check"),
    markRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),
    markAllRead: () => request("/notifications/read-all", { method: "PATCH" })
  },
  auditLogs: {
    list: (query = "") => request(`/audit-logs${query}`),
    create: (payload) => request("/audit-logs", { method: "POST", body: JSON.stringify(payload) })
  }
};
export {
  api
};
