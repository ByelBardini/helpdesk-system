import express from "express";
import {
  tempoResolucao,
  getDados,
  responsaveis,
  chamadosAbertos,
  solicitacoes,
  relatorioCompras,
} from "../controllers/relatoriosController.js";
import { autenticar } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/dados", getDados);
router.put("/resolucao", tempoResolucao);
router.put("/responsaveis", responsaveis);
router.put("/abertos", chamadosAbertos);
router.put("/solicitacoes", solicitacoes);
router.put("/compras", relatorioCompras);

export default router;
