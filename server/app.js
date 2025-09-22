import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import { ApiError } from "./middlewares/ApiError.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/", authRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/faq", faqRoutes);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      status: err.status,
      code: err.code,
      message: err.message,
      details: err.details || null,
    });
  }

  console.error(err);

  res.status(500).json({
    status: 500,
    code: "ERR_INTERNAL",
    message: "Erro interno do servidor",
  });
});
export default app;
