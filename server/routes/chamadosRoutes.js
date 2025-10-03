import express from "express";
import { anexosUpload } from "../middlewares/anexosUpload.js";
import {
  postChamado,
  getChamados,
  getChamadosSuporte,
  alterarPrioridade,
  alterarStatus,
  alterarResponsavel,
} from "../controllers/chamadosController.js";
import { autenticar, autorizarRoles } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/usuario/:role/:id", getChamados);
router.get("/suporte", autorizarRoles("suporte"), getChamadosSuporte);
router.put("/prioridade/:id", autorizarRoles("suporte"), alterarPrioridade);
router.put("/status/:id", autorizarRoles("suporte"), alterarStatus);
router.put("/responsavel/:id", autorizarRoles("suporte"), alterarResponsavel);
router.post("/", anexosUpload, postChamado);

export default router;
