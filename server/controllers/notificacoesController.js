import { Chamado, Resposta, Compra } from "../models/index.js";
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

export async function getNotificaoesChamadosUsuario(req, res) {
  const { id } = req.params;
  if (!id) {
    throw ApiError.badRequest("ID do usuário é obrigatório");
  }
  const respostas = await Resposta.findAll({
    attributes: [[fn("COUNT", col("resposta_id")), "total"]],
    include: [
      {
        model: Chamado,
        as: "chamado",
        attributes: [],
        where: { chamado_usuario_id: id },
      },
    ],
    where: {
      resposta_tipo: "suporte",
      resposta_visualizada: 0,
    },
    raw: true,
  });

  return res.status(200).json({ respostas });
}

export async function getNotificacoesCompraAdm(req, res) {
  const compras = await Compra.findAll({
    attributes: [[fn("COUNT", col("compra_id")), "total"]],
    where: {
      compra_status: "em analise",
    },
    raw: true,
  });

  return res.status(200).json({ compras });
}
