import express from "express";
import { getPerguntas } from "../controllers/faqController.js";

const router = express.Router();

router.get("/", getPerguntas);

export default router;
