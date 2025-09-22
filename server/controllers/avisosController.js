import { Aviso } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";

export async function getAvisos(req, res) {
  const avisos = await Aviso.findAll({ order: [["aviso_data", "DESC"]] });

  return res.status(200).json(avisos);
}
