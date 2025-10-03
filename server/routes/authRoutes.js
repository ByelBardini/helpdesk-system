import express from "express";
import { login, getMe } from "../controllers/authController.js";
import { autenticar } from "../middlewares/autenticaToken.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", autenticar, getMe);

export default router;
