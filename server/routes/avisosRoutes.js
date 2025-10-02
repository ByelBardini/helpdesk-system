import express from "express";
import { getAvisos, deleteAviso } from "../controllers/avisosController.js";

const router = express.Router();

router.get("/", getAvisos);
router.delete("/:id", deleteAviso);

export default router;
