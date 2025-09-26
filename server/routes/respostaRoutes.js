import express from "express";
import { anexosUpload } from "../middlewares/anexosUpload.js";
import {
  postResposta,
  visualizaResposta,
  getRespostas,
} from "../controllers/respostaController.js";

const router = express.Router();

router.get("/:id", getRespostas);
router.put("/visualiza/:id", visualizaResposta);
router.post("/:idChamado/:idUsuario", anexosUpload, postResposta);

export default router;
