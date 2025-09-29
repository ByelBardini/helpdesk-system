import express from "express";
import {
  cadastrarUsuario,
  getUsuarios,
  putUsuario,
  resetaSenha,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/", getUsuarios);
router.post("/", cadastrarUsuario);
router.put("/:id", putUsuario);
router.put("/senha/reseta/:id", resetaSenha);

export default router;
