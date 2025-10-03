import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_BASE_URL, {
  auth: (cb) => {
    cb({ token: localStorage.getItem("token") });
  },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Conectado socket:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("rro socket:", err.message);
});
