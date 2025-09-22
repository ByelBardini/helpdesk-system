import { Usuario } from "../models/index.js";
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
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err);
    if (err instanceof ApiError) throw err;
    throw ApiError.internal("Erro ao cadastrar usuário");
  }
}
