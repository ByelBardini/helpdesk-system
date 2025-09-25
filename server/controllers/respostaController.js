import { Resposta } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";

export async function postResposta(req, res) {
  const { idChamado, idUsuario } = req.params;
  if (!idChamado || !idUsuario) {
    throw ApiError.badRequest("ID do chamado e do usuário são obrigatórios");
  }
  const { descricao, tipo } = req.body;
  if (!descricao || !tipo) {
    throw ApiError.badRequest("Necessário descrição e tipo da resposta");
  }

  await Resposta.create({
    resposta_chamado_id: idChamado,
    resposta_usuario_id: idUsuario,
    resposta_descricao: descricao,
    resposta_tipo: tipo,
    resposta_visualizada: 0,
    resposta_data_emissao: new Date(),
  });

  return res.status(201).json({ message: "Resposta enviada com sucesso" });
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
