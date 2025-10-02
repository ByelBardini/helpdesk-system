import { Chamado, Resposta } from "../models/index.js";
import { fn, col, Op } from "sequelize";
import { ApiError } from "../middlewares/ApiError.js";

export async function getNotificaoesChamadosSuporte(req, res) {
  const chamados = await Chamado.findAll({
    attributes: [[fn("COUNT", col("chamado_id")), "total"]],
    where: {
      chamado_status: "em aberto",
    },
    raw: true,
  });
  const respostas = await Resposta.findAll({
    attributes: [[fn("COUNT", col("resposta_id")), "total"]],
    where: {
      resposta_tipo: "usuario",
      resposta_visualizada: 0,
    },
    raw: true,
  });

  return res.status(200).json({ chamados, respostas });
}
