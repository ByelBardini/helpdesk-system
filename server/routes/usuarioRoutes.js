import express from "express";
import {
  cadastrarUsuario,
  getUsuarios,
  putUsuario,
  resetaSenha,
  ativaInativa,
  getDados,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/", getUsuarios);
router.get("/dados", getDados);
router.post("/", cadastrarUsuario);
router.put("/:id", putUsuario);
router.put("/senha/reseta/:id", resetaSenha);
router.put("/inativa/:id", ativaInativa);

export default router;
