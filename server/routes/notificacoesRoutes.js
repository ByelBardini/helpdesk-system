import express from "express";
import {
  getNotificaoesChamadosSuporte,
  getNotificaoesChamadosUsuario,
  getNotificacoesCompraAdm,
} from "../controllers/notificacoesController.js";
import { autenticar } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/suporte", getNotificaoesChamadosSuporte);
router.get("/usuario/:id", getNotificaoesChamadosUsuario);
router.get("/compra/adm", getNotificacoesCompraAdm);

export default router;
