import sequelize from "../config/database.js";
import {
  Chamado,
  Anexo,
  Resposta,
  Usuario,
  Setor,
  Empresa,
  Area,
} from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";
import { Op, literal } from "sequelize";

const hoje = new Date();
const trintaDiasAtras = new Date();
trintaDiasAtras.setDate(hoje.getDate() - 30);

export async function getChamados(req, res) {
  const { id, role } = req.params;
  if (!id) {
    throw ApiError.badRequest("Id é necessário");
  }

  let where = {};

  if (role === "liderado") {
    where = { chamado_usuario_id: id };
  } else if (role === "supervisor") {
    where = { chamado_setor_id: id };
  } else {
    where = { chamado_empresa_id: id };
  }

  const chamados = await Chamado.findAll({
    where,
    attributes: [
      "chamado_id",
      "chamado_usuario_id",
      "chamado_data_abertura",
      "chamado_status",
      "chamado_tipo",
      "chamado_motivo",
      "chamado_descricao",
      "chamado_data_conclusao",
    ],
    order: [["chamado_data_abertura", "ASC"]],
    include: [
      {
        model: Anexo,
        as: "anexos",
        attributes: ["anexo_id", "anexo_nome", "anexo_caminho"],
        separate: true,
      },
      {
        model: Resposta,
        as: "respostas",
        attributes: [
          "resposta_id",
          "resposta_tipo",
          "resposta_visualizada",
          "resposta_data_emissao",
          "resposta_descricao",
        ],
        separate: true,
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["usuario_nome"],
          },
          {
            model: Anexo,
            as: "anexos",
            attributes: ["anexo_nome", "anexo_caminho"],
            separate: true,
          },
        ],
      },
      {
        model: Usuario,
        as: "usuario",
        attributes: ["usuario_nome", "usuario_setor_id"],
        include: [
          {
            model: Setor,
            as: "setor",
            attributes: ["setor_nome"],
          },
        ],
      },
    ],
  });

  return res.status(200).json(chamados);
}

export async function getChamadosSuporte(req, res) {
  const chamados = await Chamado.findAll({
    where: {
      [Op.or]: [
        { chamado_status: "em aberto" },
        { chamado_status: "visualizado" },
        { chamado_status: "resolvendo" },
        {
          [Op.and]: [
            { chamado_status: "resolvido" },
            {
              chamado_data_abertura: { [Op.between]: [trintaDiasAtras, hoje] },
            },
          ],
        },
      ],
    },
    order: [
      [
        literal(`
          CASE 
            WHEN chamado_prioridade = 'urgente' THEN 1
            WHEN chamado_prioridade = 'alta' THEN 2
            WHEN chamado_prioridade = 'media' THEN 3
            WHEN chamado_prioridade = 'baixa' THEN 4
            ELSE 5
          END
        `),
        "ASC",
      ],
      ["chamado_data_abertura", "ASC"],
    ],
    include: [
      {
        model: Area,
        as: "area",
        attributes: ["area_nome"],
      },
      {
        model: Anexo,
        as: "anexos",
        attributes: ["anexo_id", "anexo_nome", "anexo_caminho"],
        separate: true,
      },
      {
        model: Resposta,
        as: "respostas",
        attributes: [
          "resposta_id",
          "resposta_tipo",
          "resposta_visualizada",
          "resposta_data_emissao",
          "resposta_descricao",
        ],
        separate: true,
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["usuario_nome"],
          },
          {
            model: Anexo,
            as: "anexos",
            attributes: ["anexo_nome", "anexo_caminho"],
            separate: true,
          },
        ],
      },
      {
        model: Usuario,
        as: "usuario",
        attributes: ["usuario_nome", "usuario_setor_id"],
        include: [
          {
            model: Setor,
            as: "setor",
            attributes: ["setor_nome"],
          },
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

  return res.status(200).json(chamados);
}

export async function postChamado(req, res) {
  const b = req.body;

  const chamado_empresa_id = b.chamado_empresa_id;
  const chamado_setor_id = b.chamado_setor_id;
  const chamado_usuario_id = b.chamado_usuario_id;
  const chamado_area_id = b.chamado_area_id;
  const chamado_tipo = b.chamado_tipo;
  const chamado_motivo = b.chamado_motivo;
  const chamado_descricao = b.chamado_descricao;
  const chamado_status = "em aberto";
  const chamado_data_abertura = new Date();

  if (
    !chamado_empresa_id ||
    !chamado_setor_id ||
    !chamado_usuario_id ||
    !chamado_area_id ||
    !chamado_tipo ||
    !chamado_motivo ||
    !chamado_descricao ||
    !chamado_status ||
    !chamado_data_abertura
  ) {
    throw ApiError.badRequest("Todos os dados são obrigatórios");
  }

  const anexosArr = Array.isArray(req.anexos) ? req.anexos : [];

  await sequelize.transaction(async (t) => {
    const chamado = await Chamado.create(
      {
        chamado_empresa_id,
        chamado_setor_id,
        chamado_usuario_id,
        chamado_area_id,
        chamado_tipo,
        chamado_motivo,
        chamado_descricao,
        chamado_status,
        chamado_data_abertura,
      },
      { transaction: t }
    );

    for (const a of anexosArr) {
      await Anexo.create(
        {
          anexo_chamado_id: chamado.chamado_id,
          anexo_nome: a.nome,
          anexo_caminho: a.caminho,
        },
        { transaction: t }
      );
    }

    return res.status(201).json({ message: "Chamado criado com sucesso" });
  });
}

export async function alterarPrioridade(req, res) {
  const { id } = req.params;
  if (!id) {
    throw ApiError.badRequest("Id do chamado é obrigatório");
  }
  const { prioridade } = req.body;
  if (!prioridade) {
    throw ApiError.badRequest("Nova prioridade é obrigatória");
  }

  const chamado = await Chamado.findByPk(id);

  chamado.chamado_prioridade = prioridade;

  await chamado.save();
  return res.status(200).json({ message: "Prioridade alterada com sucesso" });
}

export async function alterarStatus(req, res) {
  const { id } = req.params;
  if (!id) {
    throw ApiError.badRequest("Id do chamado é obrigatório");
  }
  const { status, usuario_id } = req.body;
  if (!status || !usuario_id) {
    throw ApiError.badRequest("Novo status é obrigatório");
  }

  const chamado = await Chamado.findByPk(id);

  if (status == "resolvendo") {
    chamado.chamado_status = status;
    chamado.chamado_responsavel_id = usuario_id;
  } else {
    chamado.chamado_status = status;
  }

  await chamado.save();
  return res.status(200).json({ message: "Status alterado com sucesso" });
}

export async function alterarResponsavel(req, res) {
  const { id } = req.params;
  if (!id) {
    throw ApiError.badRequest("Id do chamado é obrigatório");
  }
  const { responsavel } = req.body;
  if (!responsavel) {
    throw ApiError.badRequest("Novo Responsável é obrigatório");
  }

  const chamado = await Chamado.findByPk(id);

  chamado.chamado_responsavel_id = responsavel;

  await chamado.save();
  return res.status(200).json({ message: "Responsável alterado com sucesso" });
}
