import axios from "axios";
import { useAuthStore } from "@/store/auth";

/** API Nest NexusEats (port 3002 par défaut). Pas de préfixe /api : les routes incluent /v1, /v2, /auth. */
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3002";

export const api = axios.create({ baseURL });

function unwrapSuccessPayload(body: unknown): unknown {
  if (
    body &&
    typeof body === "object" &&
    !(body instanceof Blob) &&
    "success" in body &&
    (body as { success: unknown }).success === true &&
    "data" in body
  ) {
    return (body as { data: unknown }).data;
  }
  return body;
}

api.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().token;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (res) => {
    res.data = unwrapSuccessPayload(res.data);
    return res;
  },
  async (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
