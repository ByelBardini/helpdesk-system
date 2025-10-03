import express from "express";
import {
  getDados,
  ativaInativaGeral,
  postGeral,
} from "../controllers/configController.js";
import { autenticar, autorizarRoles } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/", autorizarRoles("adm"), getDados);
router.post("/", autorizarRoles("adm"), postGeral);
router.put("/inativa/:id", autorizarRoles("adm"), ativaInativaGeral);

export default router;
