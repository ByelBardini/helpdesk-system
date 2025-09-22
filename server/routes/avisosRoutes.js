import express from "express";
import { getAvisos } from "../controllers/avisosController.js";

const router = express.Router();

router.get("/", getAvisos);

export default router;
