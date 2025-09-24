import sequelize from "../config/database.js";
import { Chamado, Anexo } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";

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
