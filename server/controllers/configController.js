import Sequelize from "sequelize";
import { Empresa, Setor, Area } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";

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

export async function ativaInativaGeral(req, res) {
  const { id } = req.params;
  const { tipo } = req.body;
  if (!id || !tipo) {
    throw ApiError.badRequest("Id e tipo são obrigatórios");
  }
  switch (tipo) {
    case "empresa": {
      const empresa = await Empresa.findByPk(id);
      empresa.empresa_ativa = !empresa.empresa_ativa;
      await empresa.save();
      break;
    }
    case "setor": {
      const setor = await Setor.findByPk(id);
      setor.setor_ativo = !setor.setor_ativo;
      await setor.save();
      break;
    }
    case "area": {
      const areas = await Area.findAll({ where: { area_nome: id } });
      await Promise.all(
        areas.map(async (area) => {
          area.area_ativa = !area.area_ativa;
          await area.save();
        })
      );
      break;
    }
    default: {
      throw ApiError.badRequest("Tipo inválido");
    }
  }
  return res
    .status(200)
    .json({ message: "Item ativado/inativado com sucesso" });
}

export async function postGeral(req, res) {
  const fd = req.body;
  if (!fd) {
    throw ApiError.badRequest("Dados são obrigatórios");
  }

  const operacao = fd.operacao;

  switch (operacao) {
    case "empresa": {
      const empresa_nome = fd.nome;
      const empresa_cnpj = fd.cnpj;

      await Empresa.create({ empresa_nome, empresa_cnpj });
      break;
    }
    case "setor": {
      const setor_nome = fd.nome;
      const setor_empresa_id = fd.empresa_id;

      await Setor.create({ setor_nome, setor_empresa_id });
      break;
    }
    case "area": {
      const area_nome = fd.nome;
      const tipos = fd.tipos;

      if (!Array.isArray(tipos) || tipos.length === 0) {
        throw ApiError.badRequest("Tipos de área são obrigatórios");
      }

      await Promise.all(
        tipos.map(async (tipo) => {
          return Area.create({ area_nome, area_tipo: tipo });
        })
      );
      break;
    }
    default: {
      throw ApiError.badRequest("Tipo inválido");
    }
  }
  return res.status(201).json({ message: "Item criado com sucesso" });
}
