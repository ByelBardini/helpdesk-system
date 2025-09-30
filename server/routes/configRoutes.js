import express from "express";
import {
  getDados,
  ativaInativaGeral,
} from "../controllers/configController.js";

const router = express.Router();

router.get("/", getDados);
router.put("/inativa/:id", ativaInativaGeral);

export default router;
