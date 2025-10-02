import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_BASE_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Conectado socket:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("rro socket:", err.message);
});
