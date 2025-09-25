import express from "express";
import { postResposta } from "../controllers/respostaController.js";

const router = express.Router();

router.post("/:idChamado/:idUsuario", postResposta);

export default router;
