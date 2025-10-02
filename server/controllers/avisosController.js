import { Aviso } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";

export async function getAvisos(req, res) {
  const avisos = await Aviso.findAll({ order: [["aviso_data", "DESC"]] });

  return res.status(200).json(avisos);
}

export async function deleteAviso(req, res) {
  const { id } = req.params;
  if (!id) {
    throw ApiError.badRequest("Id do aviso é obrigatório");
  }

  const aviso = await Aviso.findByPk(id);
  await aviso.destroy();

  return res.status(200).json({ message: "Aviso excluído com sucesso" });
}
