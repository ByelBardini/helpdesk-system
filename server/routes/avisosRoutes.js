import express from "express";
import {
  getAvisos,
  deleteAviso,
  postAviso,
} from "../controllers/avisosController.js";
import { autenticar } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.post("/", postAviso);
router.get("/", getAvisos);
router.delete("/:id", deleteAviso);

export default router;
