import express from "express";
import { getDados } from "../controllers/configController.js";

const router = express.Router();

router.get("/", getDados);

export default router;
