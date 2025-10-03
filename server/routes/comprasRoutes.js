import express from "express";
import {
  postCompras,
  getCompras,
  putStatus,
  putRecebimento,
} from "../controllers/comprasController.js";
import { autenticar } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/:id", getCompras);
router.post("/", postCompras);
router.put("/status/:id", putStatus);
router.put("/recebimento/:id", putRecebimento);

export default router;
