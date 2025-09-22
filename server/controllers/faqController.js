import { Pergunta } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";

export async function getPerguntas(req, res) {
  const perguntas = await Pergunta.findAll();

  return res.status(200).json(perguntas);
}
