import express from "express";
import {
  getNotificaoesChamadosSuporte,
  getNotificaoesChamadosUsuario,
} from "../controllers/notificacoesController.js";

const router = express.Router();

router.get("/suporte", getNotificaoesChamadosSuporte);
router.get("/usuario/:id", getNotificaoesChamadosUsuario);

export default router;
