import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { autenticar } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/", getDashboard);

export default router;
