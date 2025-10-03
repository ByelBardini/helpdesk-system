import express from "express";
import {
  postCompras,
  getCompras,
  putStatus,
  putRecebimento,
} from "../controllers/comprasController.js";
import { autenticar, autorizarRoles } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/:id", autorizarRoles("supervisor", "gerente"), getCompras);
router.post("/", autorizarRoles("supervisor", "gerente"), postCompras);
router.put("/status/:id", autorizarRoles("adm"), putStatus);
router.put("/recebimento/:id", autorizarRoles("adm"), putRecebimento);

export default router;
