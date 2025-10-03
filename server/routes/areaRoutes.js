import express from "express";
import { getAreas } from "../controllers/areaController.js";
import { autenticar } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/", getAreas);

export default router;
