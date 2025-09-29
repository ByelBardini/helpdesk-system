import { Usuario, Empresa, Setor } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";
import bcrypt from "bcrypt";

export async function cadastrarUsuario(req, res) {
  const {
    usuario_nome,
    usuario_role,
    usuario_login,
    usuario_setor,
    usuario_empresa,
  } = req.body;

  if (
    !usuario_nome ||
    !usuario_role ||
    !usuario_login ||
    !usuario_setor ||
    !usuario_empresa
  ) {
    throw ApiError.badRequest("Todos os dados são obrigatórios");
  }

  const senhaHash = bcrypt.hashSync("12345", 10);

  try {
    await Usuario.create({
      usuario_nome: usuario_nome,
      usuario_login: usuario_login,
      usuario_senha: senhaHash,
      usuario_empresa_id: usuario_empresa,
      usuario_setor_id: usuario_setor,
      usuario_role: usuario_role,
      usuario_ativo: 1,
      usuario_troca_senha: 1,
    });

    return res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err);
    if (err instanceof ApiError) throw err;
    throw ApiError.internal("Erro ao cadastrar usuário");
  }
}

export async function getUsuarios(req, res) {
  const liderados = await Usuario.findAll({
    order: [["usuario_ativo", "DESC"]],
    attributes: [
      "usuario_id",
      "usuario_nome",
      "usuario_login",
      "usuario_ativo",
    ],
    where: { usuario_role: "liderado" },
    include: [
      {
        model: Empresa,
        as: "empresa",
        attributes: ["empresa_nome"],
      },
      {
        model: Setor,
        as: "setor",
        attributes: ["setor_nome"],
      },
    ],
  });
  const supervisores = await Usuario.findAll({
    order: [["usuario_ativo", "DESC"]],
    attributes: [
      "usuario_id",
      "usuario_nome",
      "usuario_login",
      "usuario_ativo",
    ],
    where: { usuario_role: "supervisor" },
    include: [
      {
        model: Empresa,
        as: "empresa",
        attributes: ["empresa_nome"],
      },
      {
        model: Setor,
        as: "setor",
        attributes: ["setor_nome"],
      },
    ],
  });
  const gerentes = await Usuario.findAll({
    order: [["usuario_ativo", "DESC"]],
    attributes: [
      "usuario_id",
      "usuario_nome",
      "usuario_login",
      "usuario_ativo",
    ],
    where: { usuario_role: "gerente" },
    include: [
      {
        model: Empresa,
        as: "empresa",
        attributes: ["empresa_nome"],
      },
      {
        model: Setor,
        as: "setor",
        attributes: ["setor_nome"],
      },
    ],
  });
  const suportes = await Usuario.findAll({
    order: [["usuario_ativo", "DESC"]],
    attributes: [
      "usuario_id",
      "usuario_nome",
      "usuario_login",
      "usuario_ativo",
    ],
    where: { usuario_role: "suporte" },
    include: [
      {
        model: Empresa,
        as: "empresa",
        attributes: ["empresa_nome"],
      },
      {
        model: Setor,
        as: "setor",
        attributes: ["setor_nome"],
      },
    ],
  });
  const adms = await Usuario.findAll({
    order: [["usuario_ativo", "DESC"]],
    attributes: [
      "usuario_id",
      "usuario_nome",
      "usuario_login",
      "usuario_ativo",
    ],
    where: { usuario_role: "adm" },
    include: [
      {
        model: Empresa,
        as: "empresa",
        attributes: ["empresa_nome"],
      },
      {
        model: Setor,
        as: "setor",
        attributes: ["setor_nome"],
      },
    ],
  });

  res.status(200).json({ liderados, supervisores, gerentes, suportes, adms });
}
