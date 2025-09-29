import express from "express";
import {
  cadastrarUsuario,
  getUsuarios,
  putUsuario,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/", getUsuarios);
router.post("/", cadastrarUsuario);
router.put("/:id", putUsuario);

export default router;
