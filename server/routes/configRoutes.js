import express from "express";
import {
  getDados,
  ativaInativaGeral,
  postGeral,
} from "../controllers/configController.js";
import { autenticar } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/", getDados);
router.post("/", postGeral);
router.put("/inativa/:id", ativaInativaGeral);

export default router;
