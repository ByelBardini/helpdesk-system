import express from "express";
import { anexosUpload } from "../middlewares/anexosUpload.js";
import { postChamado, getChamados } from "../controllers/chamadosController.js";

const router = express.Router();

router.get("/usuario/:role/:id", getChamados);
router.post("/", anexosUpload, postChamado);

export default router;
