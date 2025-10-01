import { Compra, Usuario, Setor } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";
import { Op, literal } from "sequelize";

const hoje = new Date();
const trintaDiasAtras = new Date();
trintaDiasAtras.setDate(hoje.getDate() - 30);

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

  await Compra.create({
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

  return res
    .status(201)
    .json({ message: "Solicitação de compra enviada com sucesso" });
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
        "compra_quantidade",
        "compra_motivo",
        "compra_motivo",
        "compra_data",
        "compra_status",
        "compra_valor",
        "compra_motivo_recusa",
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
              {
                [Op.and]: [
                  { compra_status: "aprovado" },
                  { compra_data: { [Op.between]: [trintaDiasAtras, hoje] } },
                ],
              },
              {
                [Op.and]: [
                  { compra_status: "recusado" },
                  { compra_data: { [Op.between]: [trintaDiasAtras, hoje] } },
                ],
              },
            ],
          },
        ],
      },
      attributes: [
        "compra_id",
        "compra_item",
        "compra_quantidade",
        "compra_motivo",
        "compra_motivo",
        "compra_data",
        "compra_status",
        "compra_valor",
        "compra_motivo_recusa",
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
