import express from "express";
import {
  getAvisos,
  deleteAviso,
  postAviso,
} from "../controllers/avisosController.js";

const router = express.Router();

router.post("/", postAviso);
router.get("/", getAvisos);
router.delete("/:id", deleteAviso);

export default router;
