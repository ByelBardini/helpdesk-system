import express from "express";
import { getNotificaoesChamadosSuporte } from "../controllers/notificacoesController.js";

const router = express.Router();

router.get("/suporte", getNotificaoesChamadosSuporte);

export default router;
