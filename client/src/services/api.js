import axios from "axios";
import { info, warn, error as logError } from "./logger";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  info(`[API] ${config.method?.toUpperCase()} ${BASE_URL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response) {
      const { status, code, message } = err.response.data;
      logError(
        `[API] Erro ${status} em ${err.config?.url} — code: ${code} message: ${message}`
      );
      return Promise.reject({ status, code, message });
    } else if (err.request) {
      logError(
        `[API] Sem resposta em ${err.config?.url} — baseURL: ${BASE_URL}`
      );
      return Promise.reject({
        status: 503,
        code: "ERR_NO_RESPONSE",
        message: "Servidor não respondeu",
      });
    } else {
      logError(`[API] Erro Axios: ${err.message}`);
      return Promise.reject({
        status: 500,
        code: "ERR_AXIOS",
        message: err.message,
      });
    }
  }
);
