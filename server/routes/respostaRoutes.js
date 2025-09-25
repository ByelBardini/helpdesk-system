import express from "express";
import {
  postResposta,
  visualizaResposta,
} from "../controllers/respostaController.js";

const router = express.Router();

router.put("/visualiza/:id", visualizaResposta);
router.post("/:idChamado/:idUsuario", postResposta);

export default router;
