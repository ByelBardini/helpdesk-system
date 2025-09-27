import express from "express";
import {
  tempoResolucao,
  getDados,
} from "../controllers/relatoriosController.js";

const router = express.Router();

router.get("/dados", getDados);
router.put("/resolucao", tempoResolucao);

export default router;
