import express from "express";
import {
  tempoResolucao,
  getDados,
  responsaveis,
  chamadosAbertos,
  solicitacoes,
  relatorioCompras,
} from "../controllers/relatoriosController.js";
import { autenticar, autorizarRoles } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/dados", autorizarRoles("adm"), getDados);
router.put("/resolucao", autorizarRoles("adm"), tempoResolucao);
router.put("/responsaveis", autorizarRoles("adm"), responsaveis);
router.put("/abertos", autorizarRoles("adm"), chamadosAbertos);
router.put("/solicitacoes", autorizarRoles("adm"), solicitacoes);
router.put("/compras", autorizarRoles("adm"), relatorioCompras);

export default router;
