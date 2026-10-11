import axios from "axios";
import { installMockApi } from "../mocks/api";

export const isDemo = import.meta.env.VITE_MOCK_API === "true";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 15000,
});

// Demo and real sessions use separate keys so a mock token never reaches the backend.
const tokenKey = isDemo ? "adminzoom-demo-token" : "token";
export const getToken = () => localStorage.getItem(tokenKey);
export function setToken(token) {
  if (token) localStorage.setItem(tokenKey, token);
  else localStorage.removeItem(tokenKey);
}
if (isDemo) installMockApi(api);
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
