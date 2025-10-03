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

export async function putPergunta(req, res) {
  const { id } = req.params;
  if (!id) {
    throw ApiError.badRequest("Id da pergunta é obrigatório");
  }
  const { categoria, titulo, resposta } = req.body;
  if (!categoria || !titulo || !resposta) {
    throw ApiError.badRequest("Todos os dados são obrigatórios");
  }

  const pergunta = await Pergunta.findByPk(id);

  pergunta.pergunta_categoria = categoria;
  pergunta.pergunta_titulo = titulo;
  pergunta.pergunta_resposta = resposta;

  await pergunta.save();

  return res.status(200).json({ message: "Pergunta editada com sucesso" });
}
