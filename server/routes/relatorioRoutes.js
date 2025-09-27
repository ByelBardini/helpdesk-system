import express from "express";
import {
  tempoResolucao,
  getDados,
  responsaveis
} from "../controllers/relatoriosController.js";

const router = express.Router();

router.get("/dados", getDados);
router.put("/resolucao", tempoResolucao);
router.put("/responsaveis", responsaveis);

export default router;
