import express from "express";
import { anexosUpload } from "../middlewares/anexosUpload.js";
import { postChamado } from "../controllers/chamadosController.js";

const router = express.Router();

router.post("/", anexosUpload, postChamado);

export default router;
