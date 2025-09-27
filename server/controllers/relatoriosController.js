import { fn, literal, Op } from "sequelize";
import { Chamado, Empresa } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";

export async function getDados(req, res) {
  const empresas = await Empresa.findAll({
    attributes: ["empresa_id", "empresa_nome"],
  });

  return res.status(200).json(empresas);
}

export async function tempoResolucao(req, res) {
  const { dataInicio, dataFim, empresa } = req.body;

  if (!dataInicio || !dataFim || empresa === undefined) {
    throw ApiError.badRequest("Data de início, fim e empresa são obrigatórios");
  }

  const whereClause = {
    chamado_status: "resolvido",
    chamado_data_abertura: { [Op.between]: [dataInicio, dataFim] },
  };

  if (empresa !== 0) {
    whereClause.chamado_empresa_id = empresa;
  }

  const resultadoGeral = await Chamado.findOne({
    attributes: [
      [
        fn(
          "AVG",
          literal(
            "TIMESTAMPDIFF(DAY, chamado_data_abertura, chamado_data_conclusao)"
          )
        ),
        "tempo_medio_dias",
      ],
    ],
    where: whereClause,
    raw: true,
  });

  const resultadoPorPrioridade = await Chamado.findAll({
    attributes: [
      "chamado_prioridade",
      [
        fn(
          "AVG",
          literal(
            "TIMESTAMPDIFF(DAY, chamado_data_abertura, chamado_data_conclusao)"
          )
        ),
        "tempo_medio_dias",
      ],
    ],
    where: whereClause,
    group: ["chamado_prioridade"],
    raw: true,
  });

  let nomeEmpresa;

  if (empresa == 0) {
    nomeEmpresa = "Todas as empresas";
  } else {
    const pesquisa = await Empresa.findByPk(empresa);
    nomeEmpresa = pesquisa.empresa_nome;
  }

  res.json({
    nomeEmpresa: nomeEmpresa,
    tempoMedioGeral: parseFloat(resultadoGeral.tempo_medio_dias || 0).toFixed(
      2
    ),
    porPrioridade: resultadoPorPrioridade.map((r) => ({
      prioridade: r.chamado_prioridade,
      tempoMedioDias: parseFloat(r.tempo_medio_dias || 0).toFixed(2),
    })),
  });
}
