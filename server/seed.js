import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import sequelize from "./config/database.js";

// Importa via index para garantir que todos os relacionamentos sejam registrados
import { Empresa, Setor, Usuario } from "./models/index.js";

// ---------------------------------------------------------------------------
// Dados padrão — altere conforme necessário antes de rodar
// ---------------------------------------------------------------------------
const EMPRESA_NOME = "Empresa Padrão";
const SETOR_NOME = "TI";
const ADM_NOME = "Administrador";
const ADM_LOGIN = "admin";
const ADM_SENHA = "admin123"; // será armazenada como hash — troque após o primeiro login
const SALT_ROUNDS = 10;
// ---------------------------------------------------------------------------

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Conexao com o banco estabelecida.");

    // 1. Empresa padrão
    const [empresa, empresaCriada] = await Empresa.findOrCreate({
      where: { empresa_nome: EMPRESA_NOME },
      defaults: {
        empresa_nome: EMPRESA_NOME,
        empresa_cnpj: null,
        empresa_ativa: 1,
      },
    });

    console.log(
      empresaCriada
        ? `Empresa criada: "${empresa.empresa_nome}" (id: ${empresa.empresa_id})`
        : `Empresa ja existente: "${empresa.empresa_nome}" (id: ${empresa.empresa_id})`
    );

    // 2. Setor padrão vinculado à empresa
    const [setor, setorCriado] = await Setor.findOrCreate({
      where: {
        setor_nome: SETOR_NOME,
        setor_empresa_id: empresa.empresa_id,
      },
      defaults: {
        setor_nome: SETOR_NOME,
        setor_empresa_id: empresa.empresa_id,
        setor_ativo: 1,
      },
    });

    console.log(
      setorCriado
        ? `Setor criado: "${setor.setor_nome}" (id: ${setor.setor_id})`
        : `Setor ja existente: "${setor.setor_nome}" (id: ${setor.setor_id})`
    );

    // 3. Usuário administrador
    const senhaHash = bcrypt.hashSync(ADM_SENHA, SALT_ROUNDS);

    const [usuario, usuarioCriado] = await Usuario.findOrCreate({
      where: { usuario_login: ADM_LOGIN },
      defaults: {
        usuario_nome: ADM_NOME,
        usuario_login: ADM_LOGIN,
        usuario_senha: senhaHash,
        usuario_role: "adm",
        usuario_empresa_id: empresa.empresa_id,
        usuario_setor_id: setor.setor_id,
        usuario_ativo: 1,
        usuario_troca_senha: 1,
        usuario_caminho_foto: null,
      },
    });

    if (usuarioCriado) {
      console.log("Usuario administrador criado com sucesso:");
      console.log({
        usuario_id: usuario.usuario_id,
        usuario_nome: usuario.usuario_nome,
        usuario_login: usuario.usuario_login,
        usuario_role: usuario.usuario_role,
        usuario_empresa_id: usuario.usuario_empresa_id,
        usuario_setor_id: usuario.usuario_setor_id,
        usuario_ativo: usuario.usuario_ativo,
        usuario_troca_senha: usuario.usuario_troca_senha,
      });
    } else {
      console.log(
        `Usuario administrador ja existente: login "${usuario.usuario_login}" (id: ${usuario.usuario_id})`
      );
    }

    console.log("Seed concluido sem erros.");
  } catch (error) {
    console.error("Erro durante o seed:", error.message ?? error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
    console.log("Conexao com o banco encerrada.");
  }
}

seed();
