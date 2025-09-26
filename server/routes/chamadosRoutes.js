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

const router = express.Router();

router.get("/usuario/:role/:id", getChamados);
router.get("/suporte", getChamadosSuporte);
router.put("/prioridade/:id", alterarPrioridade);
router.put("/status/:id", alterarStatus);
router.put("/responsavel/:id", alterarResponsavel);
router.post("/", anexosUpload, postChamado);

export default router;
