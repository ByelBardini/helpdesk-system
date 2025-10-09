import { Chamado, Empresa, Area } from "../models/index.js";
import { fn, col, Op } from "sequelize";
import { ApiError } from "../middlewares/ApiError.js";

const hoje = new Date();
const trintaDiasAtras = new Date();
trintaDiasAtras.setDate(hoje.getDate() - 30);

console.log("Data de hoje:", hoje);
console.log("Data de 30 dias atrás:", trintaDiasAtras);

export async function getDashboard(req, res) {
  const empresas = await Chamado.findAll({
    attributes: [
      "chamado_empresa_id",
      [fn("COUNT", col("chamado_id")), "total"],
    ],
    where: {
      chamado_data_abertura: {
        [Op.between]: [trintaDiasAtras, hoje],
      },
    },
    include: [
      {
        model: Empresa,
        as: "empresa",
        attributes: ["empresa_nome"],
      },
    ],
    group: ["chamado_empresa_id", "empresa.empresa_nome"],
    raw: true,
  });

  const tipos = await Chamado.findAll({
    attributes: ["chamado_tipo", [fn("COUNT", col("chamado_id")), "total"]],
    where: {
      chamado_data_abertura: {
        [Op.between]: [trintaDiasAtras, hoje],
      },
    },
    group: ["chamado_tipo"],
    raw: true,
  });

  const areas = await Chamado.findAll({
    attributes: [
      [col("area.area_nome"), "area_nome"],
      [fn("COUNT", col("chamado_id")), "total"],
    ],
    where: {
      chamado_data_abertura: {
        [Op.between]: [trintaDiasAtras, hoje],
      },
    },
    include: [
      {
        model: Area,
        as: "area",
        attributes: [],
      },
    ],
    group: ["area.area_nome"],
    raw: true,
  });

  const novos = await Chamado.count({
    where: { chamado_status: "em aberto" },
  });

  const visualizados = await Chamado.count({
    where: { chamado_status: "visualizado" },
  });

  const resolvendo = await Chamado.count({
    where: { chamado_status: "resolvendo" },
  });

  const resolvidos = await Chamado.findAll({
    attributes: [[fn("COUNT", col("chamado_id")), "total"]],
    where: {
      chamado_status: "resolvido",
      chamado_data_conclusao: {
        [Op.between]: [trintaDiasAtras, hoje],
      },
    },
    raw: true,
  });

  const solicitacoes = await Chamado.findAll({
    attributes: ["chamado_status", [fn("COUNT", col("chamado_id")), "total"]],
    where: {
      chamado_tipo: "solicitacao",
      chamado_data_abertura: {
        [Op.between]: [trintaDiasAtras, hoje],
      },
    },
    group: ["chamado_status"],
    raw: true,
  });

  const erros = await Chamado.findAll({
    attributes: ["chamado_status", [fn("COUNT", col("chamado_id")), "total"]],
    where: {
      chamado_tipo: "erro",
      chamado_data_abertura: {
        [Op.between]: [trintaDiasAtras, hoje],
      },
    },
    group: ["chamado_status"],
    raw: true,
  });

  const melhorias = await Chamado.findAll({
    attributes: ["chamado_status", [fn("COUNT", col("chamado_id")), "total"]],
    where: {
      chamado_tipo: "melhoria",
      chamado_data_abertura: {
        [Op.between]: [trintaDiasAtras, hoje],
      },
    },
    group: ["chamado_status"],
    raw: true,
  });

  return res.status(200).json({
    empresas,
    tipos,
    areas,
    novos,
    visualizados,
    resolvendo,
    resolvidos,
    solicitacoes,
    erros,
    melhorias,
  });
}
