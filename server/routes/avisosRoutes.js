import express from "express";
import {
  getAvisos,
  deleteAviso,
  postAviso,
} from "../controllers/avisosController.js";
import { autenticar, autorizarRoles } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.post("/", autorizarRoles("adm"), postAviso);
router.get("/", getAvisos);
router.delete("/:id", autorizarRoles("adm"), deleteAviso);

export default router;
