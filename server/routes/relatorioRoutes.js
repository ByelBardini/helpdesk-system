import express from "express";
import {
  tempoResolucao,
  getDados,
  responsaveis,
  chamadosAbertos,
  solicitacoes,
} from "../controllers/relatoriosController.js";

const router = express.Router();

router.get("/dados", getDados);
router.put("/resolucao", tempoResolucao);
router.put("/responsaveis", responsaveis);
router.put("/abertos", chamadosAbertos);
router.put("/solicitacoes", solicitacoes);

export default router;
