import db from "./../config/db.js";

// GETS
//ADM
export const getComentariosAdm = (req, res) => {
  const id_chamado = req.params.id;

  const sql = `SELECT * FROM comentarios WHERE comentario_chamado_id = ?`;

  db.query(sql, [id_chamado], (err, result) => {
    if (err) {
      console.log("Erro ao buscar comentários: ", err);
      return res.status(500).json({ error: "Erro ao buscar comentários." });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Nenhum comentário encontrado." });
    }
    res.status(200).json(result);
  });
};

//USUÁRIO
export const getComentario = (req, res) => {
  const id_chamado = req.params.id;

  if (!id_chamado) {
    return res.status(400).json({ message: "ID do chamado é obrigatório!" });
  }

  const sql = `SELECT comentario_observacoes_chamado FROM comentarios WHERE comentario_chamado_id = ?`;

  db.query(sql, [id_chamado], (err, result) => {
    if (err) {
      console.log("Erro ao buscar comentários: ", err);
      return res.status(500).json({ error: "Erro ao buscar comentários." });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Nenhum comentário encontrado." });
    }
    res.status(200).json(result);
  });
};

// PUTS
export const putComentarioUsuario = (req, res) => {
  const id_comentario = req.params.id;
  const { comentario_observacoes_chamado } = req.body;

  if (!comentario_observacoes_chamado) {
    return res
      .status(400)
      .json({ message: "Observações do comentário são obrigatórias!" });
  }

  const sql = `UPDATE comentarios SET comentario_observacoes_chamado = ? WHERE comentario_id = ?`;

  db.query(
    sql,
    [comentario_observacoes_chamado, id_comentario],
    (err, results) => {
      if (err) {
        console.log("Erro ao atualizar comentário: ", err);
        return res.status(500).json({ error: "Erro ao atualizar comentário." });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Comentário não encontrado." });
      }
      res.status(200).json({ message: "Comentário atualizado com sucesso!" });
    }
  );
};

// POST
export const postComentario = (req, res) => {
  const {
    comentario_chamado_id,
    comentario_responsavel_id,
    comentario_solucao_aplicada,
    comentario_classificacao_pos,
    comentario_observacoes,
    comentario_observacoes_chamado,
    comentario_ticket_outro_sistema,
  } = req.body;

  db.query(
    `INSERT INTO comentarios (comentario_chamado_id, comentario_responsavel_id, comentario_solucao_aplicada, comentario_classificacao_pos, comentario_observacoes, comentario_observacoes_chamado, comentario_ticket_outro_sistema, comentario_data) 
              VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      comentario_chamado_id,
      comentario_responsavel_id,
      comentario_solucao_aplicada,
      comentario_classificacao_pos,
      comentario_observacoes,
      comentario_observacoes_chamado,
      comentario_ticket_outro_sistema,
    ],
    (err, results) => {
      if (err) {
        console.log("Erro ao criar comentário: ", err);
        return res.status(500).json({ error: "Erro ao criar comentário." });
      }
      res.status(201).json({ message: "Comentário criado com sucesso!" });
    }
  );
};
