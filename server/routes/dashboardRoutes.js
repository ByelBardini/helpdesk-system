import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { autenticar, autorizarRoles } from "../middlewares/autenticaToken.js";

const router = express.Router();
router.use(autenticar);

router.get("/", autorizarRoles("suporte"), getDashboard);

export default router;
