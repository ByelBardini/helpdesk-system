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

export async function postAviso(req, res) {
  const { importancia, titulo, descricao } = req.body;
  if (!importancia || !titulo || !descricao) {
    throw ApiError.badRequest("Todos os dados são obrigatórios");
  }

  await Aviso.create({
    aviso_importancia: importancia,
    aviso_titulo: titulo,
    aviso_descricao: descricao,
    aviso_data: new Date(),
  });

  return res.status(201).json({ message: "Aviso criado com sucesso" });
}
