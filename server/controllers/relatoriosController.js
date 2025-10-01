import ExcelJS from "exceljs";
import { fn, literal, Op, col } from "sequelize";
import { Chamado, Empresa, Usuario, Area, Compra } from "../models/index.js";
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

export async function responsaveis(req, res) {
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

  const usuarios = await Usuario.findAll({
    attributes: ["usuario_id", "usuario_nome", "usuario_role"],
    where: {
      usuario_role: { [Op.in]: ["adm", "suporte"] },
    },
    raw: true,
  });

  const chamadosPorResponsavel = await Chamado.findAll({
    attributes: [
      "chamado_responsavel_id",
      "chamado_prioridade",
      [fn("COUNT", col("chamado_id")), "total"],
    ],
    where: whereClause,
    group: ["chamado_responsavel_id", "chamado_prioridade"],
    raw: true,
  });

  const totaisGerais = await Chamado.findAll({
    attributes: [
      "chamado_prioridade",
      [fn("COUNT", col("chamado_id")), "total"],
    ],
    where: whereClause,
    group: ["chamado_prioridade"],
    raw: true,
  });

  const totalGeral = totaisGerais.reduce(
    (acc, t) => acc + parseInt(t.total, 10),
    0
  );

  const resultado = usuarios.map((u) => {
    const registros = chamadosPorResponsavel.filter(
      (c) => c.chamado_responsavel_id === u.usuario_id
    );

    const totalUser = registros.reduce(
      (acc, r) => acc + parseInt(r.total, 10),
      0
    );

    return {
      usuario_id: u.usuario_id,
      nome: u.usuario_nome,
      role: u.usuario_role,
      total: totalUser,
      porcentagem:
        totalGeral > 0 ? ((totalUser / totalGeral) * 100).toFixed(2) : "0.00",
      prioridades: {
        baixa:
          registros.find((r) => r.chamado_prioridade === "baixa")?.total || 0,
        media:
          registros.find((r) => r.chamado_prioridade === "media")?.total || 0,
        alta:
          registros.find((r) => r.chamado_prioridade === "alta")?.total || 0,
        urgente:
          registros.find((r) => r.chamado_prioridade === "urgente")?.total || 0,
      },
    };
  });

  let nomeEmpresa;
  if (empresa == 0) {
    nomeEmpresa = "Todas as empresas";
  } else {
    const pesquisa = await Empresa.findByPk(empresa);
    nomeEmpresa = pesquisa.empresa_nome;
  }

  res.json({
    nomeEmpresa,
    totalGeral,
    totaisGerais,
    responsaveis: resultado,
  });
}

export async function chamadosAbertos(req, res) {
  const { dataInicio, dataFim, empresa } = req.body;

  if (!dataInicio || !dataFim || empresa === undefined) {
    throw ApiError.badRequest("Data de início, fim e empresa são obrigatórios");
  }

  const whereClause = {
    chamado_data_abertura: { [Op.between]: [dataInicio, dataFim] },
  };

  if (empresa !== 0) {
    whereClause.chamado_empresa_id = empresa;
  }

  const chamados = await Chamado.findAll({
    where: whereClause,
    include: [
      {
        model: Area,
        as: "area",
        attributes: ["area_nome"],
      },
      {
        model: Usuario,
        as: "usuario",
        attributes: ["usuario_nome"],
        include: [
          {
            model: Empresa,
            as: "empresa",
            attributes: ["empresa_nome"],
          },
        ],
      },
      {
        model: Usuario,
        as: "responsavel",
        attributes: ["usuario_id", "usuario_nome"],
      },
    ],
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Chamados");

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Empresa", key: "empresa", width: 25 },
    { header: "Usuário", key: "usuario", width: 25 },
    { header: "Responsável", key: "responsavel", width: 25 },
    { header: "Área", key: "area", width: 20 },
    { header: "Status", key: "status", width: 15 },
    { header: "Prioridade", key: "prioridade", width: 15 },
    { header: "Data Abertura", key: "data_abertura", width: 20 },
    { header: "Data Conclusão", key: "data_conclusao", width: 20 },
  ];

  chamados.forEach((ch) => {
    worksheet.addRow({
      id: ch.chamado_id,
      empresa: ch.usuario?.empresa?.empresa_nome || "-",
      usuario: ch.usuario?.usuario_nome || "-",
      responsavel: ch.responsavel?.usuario_nome || "-",
      area: ch.area?.area_nome || "-",
      status: ch.chamado_status,
      prioridade: ch.chamado_prioridade || "-",
      data_abertura: ch.chamado_data_abertura,
      data_conclusao: ch.chamado_data_conclusao
        ? ch.chamado_data_conclusao
        : "-",
    });
  });

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E78" },
    };
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", 'attachment; filename="chamados.xlsx"');

  const buffer = await workbook.xlsx.writeBuffer();
  res.send(buffer);
}

export async function solicitacoes(req, res) {
  const { dataInicio, dataFim, empresa } = req.body;

  if (!dataInicio || !dataFim || empresa === undefined) {
    throw ApiError.badRequest("Data de início, fim e empresa são obrigatórios");
  }

  const whereClause = {
    compra_data: { [Op.between]: [dataInicio, dataFim] },
  };

  if (empresa !== 0) {
    whereClause.compra_empresa_id = empresa;
  }
  const result = await Compra.findAll({
    attributes: [
      [
        fn("SUM", literal("compra_valor * COALESCE(compra_quantidade, 1)")),
        "totalGeral",
      ],

      [
        fn(
          "SUM",
          literal(`CASE WHEN compra_tipo = 'servico' 
                                THEN compra_valor * COALESCE(compra_quantidade, 1) 
                                ELSE 0 END`)
        ),
        "totalServicos",
      ],

      [
        fn(
          "SUM",
          literal(`CASE WHEN compra_tipo = 'produto' 
                                THEN compra_valor * COALESCE(compra_quantidade, 1) 
                                ELSE 0 END`)
        ),
        "totalProdutos",
      ],
    ],
    where: {
      ...whereClause,
      compra_status: "aprovado",
    },
    raw: true,
  });

  return res.status(200).json(result[0]);
}
