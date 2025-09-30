import Sequelize from "sequelize";
import { Empresa, Setor, Area } from "../models/index.js";

export async function getDados(req, res) {
  const empresas = await Empresa.findAll({
    attributes: ["empresa_id", "empresa_nome", "empresa_ativa"],
  });
  const setores = await Setor.findAll({
    attributes: ["setor_id", "setor_nome", "setor_ativo"],
    include: [
      {
        model: Empresa,
        as: "empresa",
        attributes: ["empresa_nome"],
      },
    ],
  });
  const areas = await Area.findAll({
    attributes: [
      "area_nome",
      [Sequelize.fn("MAX", Sequelize.col("area_ativa")), "area_ativa"],
      [
        Sequelize.fn(
          "GROUP_CONCAT",
          Sequelize.fn("DISTINCT", Sequelize.col("area_tipo"))
        ),
        "tipos",
      ],
    ],
    group: ["area_nome"],
    raw: true,
  });

  return res.status(200).json({ empresas, setores, areas });
}
