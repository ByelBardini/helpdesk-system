import sequelize from "../config/database.js";
import { Resposta, Anexo } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";

export async function postResposta(req, res) {
  const { idChamado, idUsuario } = req.params;
  if (!idChamado || !idUsuario) {
    throw ApiError.badRequest("ID do chamado e do usuário são obrigatórios");
  }
  const b = req.body;

  const descricao = b.descricao;
  const tipo = b.tipo;

  if (!descricao || !tipo) {
    throw ApiError.badRequest("Necessário descrição e tipo da resposta");
  }

  const anexosArr = Array.isArray(req.anexos) ? req.anexos : [];

  await sequelize.transaction(
    await sequelize.transaction(async (t) => {
      const resposta = await Resposta.create(
        {
          resposta_chamado_id: idChamado,
          resposta_usuario_id: idUsuario,
          resposta_descricao: descricao,
          resposta_tipo: tipo,
          resposta_visualizada: 0,
          resposta_data_emissao: new Date(),
        },
        {
          transaction: t,
        }
      );

      for (const a of anexosArr) {
        await Anexo.create(
          {
            anexo_resposta_id: resposta.resposta_id,
            anexo_nome: a.nome,
            anexo_caminho: a.caminho,
          },
          { transaction: t }
        );
      }

      return res.status(201).json({ message: "Resposta enviada com sucesso" });
    })
  );
}

export async function visualizaResposta(req, res) {
  const { id } = req.params;
  if (!id) {
    throw ApiError.badRequest("ID da resposta é obrigatório");
  }

  const resposta = await Resposta.findByPk(id);
  resposta.resposta_visualizada = 1;
  await resposta.save();

  return res.status(200).json({ message: "Mensagem visualizada" });
}
