import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import avisoRoutes from "./routes/avisosRoutes.js";
import areaRoutes from "./routes/areaRoutes.js";
import chamadoRoutes from "./routes/chamadosRoutes.js";
import respostaRoutes from "./routes/respostaRoutes.js";
import downloadRoutes from "./routes/downloadRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { ApiError } from "./middlewares/ApiError.js";
import { limpaArquivosAntigos } from "./middlewares/limpaAnexosAntigos.js";

cron.schedule("0 3 * * *", () => {
  limpaArquivosAntigos({}, {}, () => {});
});

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
app.use("/", downloadRoutes);
app.use("/usuario", usuarioRoutes);
app.use("/faq", faqRoutes);
app.use("/aviso", avisoRoutes);
app.use("/area", areaRoutes);
app.use("/chamado", chamadoRoutes);
app.use("/resposta", respostaRoutes);
app.use("/dashboard", dashboardRoutes);

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
