import express from "express";
import { getPerguntas, deletePergunta } from "../controllers/faqController.js";
import { autenticar, autorizarRoles } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/", getPerguntas);
router.delete("/:id", autorizarRoles("adm"), deletePergunta);

export default router;
