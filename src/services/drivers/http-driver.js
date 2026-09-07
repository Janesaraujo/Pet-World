import { API_URL, RESOURCE } from "../api-config.js";

/**
 * HTTP driver: talks to json-server.
 * Used in development (npm run dev).
 */
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status} accessing ${path}`);
  }

  return response.status === 204 ? null : response.json();
}

export function list({ date }) {
  return request(`/${RESOURCE}?when=${encodeURIComponent(date)}`);
}

export function create(schedule) {
  return request(`/${RESOURCE}`, {
    method: "POST",
    body: JSON.stringify(schedule),
  });
}

export function remove({ id }) {
  return request(`/${RESOURCE}/${id}`, { method: "DELETE" });
}
