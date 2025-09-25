import express from "express";
import { anexosUpload } from "../middlewares/anexosUpload.js";
import {
  postChamado,
  getChamadosUsuario,
} from "../controllers/chamadosController.js";

const router = express.Router();

router.get("/usuario/:id", getChamadosUsuario);
router.post("/", anexosUpload, postChamado);

export default router;
