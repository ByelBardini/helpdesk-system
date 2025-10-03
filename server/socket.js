import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let ioRef = null;

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(",") ?? true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");
      if (!token) return next(new Error("No token"));
      const payload = jwt.verify(token, process.env.SECRET_KEY_LOGIN);

      socket.userId = payload.usuario_id;
      socket.userRole = payload.usuario_role;

      if (!socket.userId) return next(new Error("Bad token payload"));
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);

    if (
      String(socket.userRole).toLowerCase().includes("adm") ||
      String(socket.userRole).toLowerCase().includes("suporte")
    ) {
      socket.join("suporte");
    }
    if (String(socket.userRole).toLowerCase().includes("adm")) {
      socket.join("adm");
    }
    console.log("Usuário conectado:", socket.userId, "role:", socket.userRole);

    socket.on("join_chamado", ({ chamadoId }) => {
      if (chamadoId) socket.join(`chamado:${chamadoId}`);
    });

    socket.on("leave_chamado", ({ chamadoId }) => {
      if (chamadoId) socket.leave(`chamado:${chamadoId}`);
    });

    socket.on("disconnect", () => {});
  });

  ioRef = io;
  return io;
}

export function io() {
  if (!ioRef) throw new Error("Socket.IO não inicializado");
  return ioRef;
}

export const notifyUser = (userId, event, payload) => {
  console.log("Enviou");
  io().to(`user:${userId}`).emit(event, payload);
};
export const notifySuporte = (event, payload) => {
  console.log("Enviou");
  io().to("suporte").emit(event, payload);
};
export const notifyAdm = (event, payload) => {
  console.log("Enviou");
  io().to("adm").emit(event, payload);
};
