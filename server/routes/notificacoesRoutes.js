import express from "express";
import {
  getNotificaoesChamadosSuporte,
  getNotificaoesChamadosUsuario,
  getNotificacoesCompraAdm,
} from "../controllers/notificacoesController.js";
import { autenticar, autorizarRoles } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get(
  "/suporte",
  autorizarRoles("suporte"),
  getNotificaoesChamadosSuporte
);
router.get("/usuario/:id", getNotificaoesChamadosUsuario);
router.get("/compra/adm", autorizarRoles("adm"), getNotificacoesCompraAdm);

export default router;
