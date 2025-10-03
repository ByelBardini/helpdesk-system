import express from "express";
import { getPerguntas } from "../controllers/faqController.js";
import { autenticar } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/", getPerguntas);

export default router;
