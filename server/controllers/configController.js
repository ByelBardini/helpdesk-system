import Sequelize from "sequelize";
import { Empresa, Setor, Area } from "../models/index.js";

export async function getDados(req, res) {
  const empresas = await Empresa.findAll({
    attributes: ["empresa_id", "empresa_nome"],
  });
  const setores = await Setor.findAll({
    attributes: ["setor_id", "setor_nome"],
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
