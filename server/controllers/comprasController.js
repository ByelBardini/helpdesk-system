import { Compra, Usuario, Setor } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";
import { Op, literal } from "sequelize";
import { notifyUser, notifyAdm } from "../socket.js";

const hoje = new Date();
const trintaDiasAtras = new Date();
trintaDiasAtras.setDate(hoje.getDate() - 30);

const umAnoAtras = new Date();
umAnoAtras.setDate(hoje.getDate() - 365);

export async function postCompras(req, res) {
  console.log(req.body);
  const {
    empresa_id,
    setor_id,
    solicitante_id,
    item,
    quantidade,
    motivo,
    tipo,
  } = req.body;
  if (
    !empresa_id ||
    !setor_id ||
    !solicitante_id ||
    !item ||
    !motivo ||
    !tipo
  ) {
    throw ApiError.badRequest("Todos os dados são obrigatórios");
  }

  const compra = await Compra.create({
    compra_empresa_id: empresa_id,
    compra_setor_id: setor_id,
    compra_solicitante_id: solicitante_id,
    compra_item: item,
    compra_tipo: tipo,
    compra_quantidade: quantidade,
    compra_motivo: motivo,
    compra_data: new Date(),
    compra_status: "em analise",
  });

  const solicitante = await Usuario.findByPk(solicitante_id);

  const payload = {
    solicitante: solicitante.usuario_nome,
    produto: compra.compra_item,
    tipo: compra.compra_tipo,
  };

  notifyAdm("compra:new", payload);

  return res
    .status(201)
    .json({ message: "Solicitação de compra enviada com sucesso" });
}

export async function putStatus(req, res) {
  const { id } = req.params;
  const { status, alt } = req.body;
  if (!id || !status) {
    throw ApiError.badRequest("Id e status são obrigatórios");
  }

  const solicitacao = await Compra.findByPk(id);

  if (status == "aprovado") {
    solicitacao.compra_status = status;
    solicitacao.compra_recebida = "a caminho";
    solicitacao.compra_valor = alt;
    await solicitacao.save();

    const payload = {
      produto: solicitacao.compra_item,
      tipo: solicitacao.compra_tipo,
      status: solicitacao.compra_recebida,
    };

    notifyUser(solicitacao.compra_solicitante_id, "compra:aproved", payload);
  } else {
    solicitacao.compra_status = status;
    solicitacao.compra_motivo_recusa = alt;
    await solicitacao.save();

    const payload = {
      produto: solicitacao.compra_item,
      tipo: solicitacao.compra_tipo,
      motivo: solicitacao.compra_motivo_recusa,
    };

    notifyUser(solicitacao.compra_solicitante_id, "compra:denied", payload);
  }

  return res.status(200).json({ message: "Status alterado com sucesso" });
}

export async function putRecebimento(req, res) {
  const { id } = req.params;
  if (!id) {
    throw ApiError.badRequest("Id é obrigatório");
  }

  const solicitacao = await Compra.findByPk(id);

  solicitacao.compra_recebida = "recebido";
  solicitacao.compra_data_recebimento = new Date();
  await solicitacao.save();

  const payload = {
    produto: solicitacao.compra_item,
    tipo: solicitacao.compra_tipo,
  };

  notifyUser(solicitacao.compra_solicitante_id, "compra:recieved", payload);

  return res
    .status(200)
    .json({ message: "Situação de entrega atualizada com sucesso" });
}

export async function getCompras(req, res) {
  const { id } = req.params;
  if (!id) {
    throw ApiError.badRequest("ID do usuário é obrigatório");
  }
  const usuario = await Usuario.findByPk(id);

  if (usuario.usuario_role == "liderado" || usuario.usuario_role == "suporte") {
    throw ApiError.unauthorized(
      "Função não permitida para seu tipo de usuário"
    );
  }
  if (usuario.usuario_role == "supervisor") {
    const compras = await Compra.findAll({
      where: { compra_solicitante_id: id },
      attributes: [
        "compra_id",
        "compra_item",
        "compra_tipo",
        "compra_quantidade",
        "compra_motivo",
        "compra_motivo",
        "compra_data",
        "compra_status",
        "compra_valor",
        "compra_motivo_recusa",
        "compra_recebida",
        "compra_data_recebimento",
      ],
    });

    return res.status(200).json(compras);
  }
  if (usuario.usuario_role == "gerente") {
    const compras = await Compra.findAll({
      where: {
        [Op.and]: [
          { compra_empresa_id: usuario.usuario_empresa_id },
          {
            [Op.or]: [
              { compra_status: "em analise" },
              { compra_recebida: "a caminho" },
              {
                [Op.and]: [
                  { compra_status: "aprovado" },
                  { compra_data: { [Op.between]: [umAnoAtras, hoje] } },
                ],
              },
              {
                [Op.and]: [
                  { compra_status: "recusado" },
                  {
                    compra_data: {
                      [Op.between]: [umAnoAtras, hoje],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      attributes: [
        "compra_id",
        "compra_tipo",
        "compra_item",
        "compra_quantidade",
        "compra_motivo",
        "compra_motivo",
        "compra_data",
        "compra_status",
        "compra_valor",
        "compra_motivo_recusa",
        "compra_recebida",
        "compra_data_recebimento",
      ],
      include: [
        {
          model: Usuario,
          as: "solicitante",
          attributes: ["usuario_nome"],
        },
        {
          model: Setor,
          as: "setor",
          attributes: ["setor_nome"],
        },
      ],
    });

    return res.status(200).json(compras);
  }
  if (usuario.usuario_role == "adm") {
    const compras = await Compra.findAll({
      where: {
        [Op.or]: [
          { compra_status: "em analise" },
          { compra_recebida: "a caminho" },
          {
            [Op.and]: [
              { compra_status: "aprovado" },
              {
                compra_data: {
                  [Op.between]: [trintaDiasAtras, hoje],
                },
              },
            ],
          },
          {
            [Op.and]: [
              { compra_status: "recusado" },
              {
                compra_data: {
                  [Op.between]: [trintaDiasAtras, hoje],
                },
              },
            ],
          },
        ],
      },
      include: [
        {
          model: Usuario,
          as: "solicitante",
          attributes: ["usuario_nome"],
        },
        {
          model: Setor,
          as: "setor",
          attributes: ["setor_nome"],
        },
      ],
      order: [
        [
          literal(`
          CASE 
            WHEN compra_status = 'em analise' THEN 1
            ELSE 2
          END
        `),
          "ASC",
        ],
        ["compra_data", "DESC"],
      ],
    });

    return res.status(200).json(compras);
  }
}
