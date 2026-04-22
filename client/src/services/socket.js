import { io } from "socket.io-client";
import { info, error as logError } from "./logger";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const socket = io(BASE_URL, {
  auth: (cb) => {
    cb({ token: localStorage.getItem("token") });
  },
  transports: ["websocket"],
});

socket.on("connect", () => {
  info(`[Socket] Conectado — id: ${socket.id} — url: ${BASE_URL}`);
});

socket.on("connect_error", (err) => {
  logError(`[Socket] Erro de conexão — url: ${BASE_URL} — ${err.message}`);
});

socket.on("disconnect", (reason) => {
  info(`[Socket] Desconectado — reason: ${reason}`);
});
