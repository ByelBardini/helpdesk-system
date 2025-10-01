import express from "express";
import { postCompras } from "../controllers/comprasController.js";

const router = express.Router();

router.post("/", postCompras);

export default router;
