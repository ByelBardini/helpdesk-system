import express from "express";
import {
  cadastrarUsuario,
  getUsuarios,
  putUsuario,
  resetaSenha,
  ativaInativa,
  getDados,
  trocarSenha,
} from "../controllers/usuarioController.js";
import { autenticar, autorizarRoles } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/", autorizarRoles("adm"), getUsuarios);
router.get("/dados", autorizarRoles("adm"), getDados);
router.post("/", autorizarRoles("adm"), cadastrarUsuario);
router.put("/:id", autorizarRoles("adm"), putUsuario);
router.put("/senha/reseta/:id", autorizarRoles("adm"), resetaSenha);
router.put("/inativa/:id", autorizarRoles("adm"), ativaInativa);
router.put("/senha/:id", trocarSenha);

export default router;
