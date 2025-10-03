import { Pergunta } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";

export async function getPerguntas(req, res) {
  const perguntas = await Pergunta.findAll();

  return res.status(200).json(perguntas);
}

export async function deletePergunta(req, res) {
  const { id } = req.params;
  if (!id) {
    throw ApiError.badRequest("Id da pergunta é obrigatório");
  }

  const pergunta = await Pergunta.findByPk(id);

  await pergunta.destroy();

  return res.status(200).json({ message: "Pergunta deletada com sucesso" });
}
