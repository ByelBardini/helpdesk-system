import express from "express";
import {
  postCompras,
  getCompras,
  putStatus,
} from "../controllers/comprasController.js";

const router = express.Router();

router.get("/:id", getCompras);
router.post("/", postCompras);
router.put("/status/:id", putStatus);

export default router;
