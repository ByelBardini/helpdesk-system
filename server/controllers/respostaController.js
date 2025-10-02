import sequelize from "../config/database.js";
import { Resposta, Anexo, Usuario, Chamado } from "../models/index.js";
import { ApiError } from "../middlewares/ApiError.js";
import { notifyUser, notifySuporte } from "../socket.js";

export async function getRespostas(req, res) {
  const { id } = req.params;
  if (!id) {
    throw ApiError.badRequest("ID do chamado é obrigatório");
  }

  const respostas = await Resposta.findAll({
    where: { resposta_chamado_id: id },
    attributes: [
      "resposta_id",
      "resposta_tipo",
      "resposta_visualizada",
      "resposta_data_emissao",
      "resposta_descricao",
    ],
    order: [["resposta_data_emissao", "ASC"]],
    include: [
      {
        model: Usuario,
        as: "usuario",
        attributes: ["usuario_nome"],
      },
      {
        model: Anexo,
        as: "anexos",
        attributes: ["anexo_nome", "anexo_caminho"],
        separate: true,
      },
    ],
  });

  return res.status(200).json(respostas);
}

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

  let respostaCriada = null;

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

    respostaCriada = resposta;

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
  });
  const chamado = await Chamado.findByPk(idChamado, {
    attributes: ["chamado_id", "chamado_motivo", "chamado_usuario_id"],
  });
  const usuario = await Usuario.findByPk(idUsuario, {
    attributes: ["usuario_role"],
  });

  if (chamado) {
    const payload = {
      titulo: chamado.chamado_motivo,
      snippet: descricao.slice(0, 120),
    };

    if (usuario.usuario_role == "adm" || usuario.usuario_role == "suporte") {
      notifyUser(chamado.chamado_usuario_id, "reply:new", payload);
    } else {
      notifySuporte("reply:new", payload);
    }
  }

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
