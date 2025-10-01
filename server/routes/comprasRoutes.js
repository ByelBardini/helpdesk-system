import express from "express";
import { postCompras, getCompras } from "../controllers/comprasController.js";

const router = express.Router();

router.get("/:id", getCompras);
router.post("/", postCompras);

export default router;
