import express from "express";
import {
  cadastrarUsuario,
  getUsuarios,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/", getUsuarios);
router.post("/", cadastrarUsuario);

export default router;
