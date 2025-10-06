import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { initSocket } from "./socket.js";

dotenv.config();

const server = http.createServer(app);

initSocket(server);

server.listen(3034, "0.0.0.0", () => {
  console.log("Server aberto na porta 3034");
});
