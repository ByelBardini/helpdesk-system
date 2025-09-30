import express from "express";
import {
  getDados,
  ativaInativaGeral,
  postGeral,
} from "../controllers/configController.js";

const router = express.Router();

router.get("/", getDados);
router.post("/", postGeral);
router.put("/inativa/:id", ativaInativaGeral);

export default router;
