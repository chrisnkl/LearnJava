import type { ApiResponse } from "../domain";
import { TOKEN_STORAGE_KEY } from "../utils/Constants";

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.location.href = "/login";
    }
    throw new Error(json.message || `Request failed with status ${response.status}`);
  }

  return json.data;
}

