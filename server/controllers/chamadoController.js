import db from "./../config/db.js";

// GETS
//ADM
export const getChamadosMesAdm = (req, res) => {
  const sql = `SELECT * FROM chamados 
                 WHERE chamado_data_abertura BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE() 
                       OR chamado_status_id IN (1, 2, 3, 4, 5)`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Erro ao buscar chamados do mês: ", err);
      return res.status(500).json({ error: "Erro ao buscar chamados do mês." });
    }
    res.status(200).json(results);
  });
};

export const getChamadosGeralAdm = (req, res) => {
  const sql = `SELECT * FROM chamados`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Erro ao buscar chamados gerais: ", err);
      return res.status(500).json({ error: "Erro ao buscar chamados gerais." });
    }
    res.status(200).json(results);
  });
};

// Usuario
export const getChamadoId = (req, res) => {
  const chamado_id = req.params.id;

  if (!chamado_id) {
    return res.status(400).json({ message: "ID do chamado é obrigatório!" });
  }

  const sql = `SELECT (chamado_usuario_id, chamado_categoria_id, chamado_status_id, chamado_tipo, chamado_motivo, chamado_descricao, chamado_data_abertura, chamado_prazo, chamado_data_fechamento) FROM chamados WHERE chamado_id = ?`;

  db.query(sql, [chamado_id], (err, results) => {
    if (err) {
      console.log("Erro ao buscar chamado por ID: ", err);
      return res.status(500).json({ error: "Erro ao buscar chamado por ID." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Chamado não encontrado." });
    }
    res.status(200).json(results[0]);
  });
};

export const getChamadosUsuario = (req, res) => {
  const usuario_id = req.params.id;

  if (!usuario_id) {
    return res.status(400).json({ message: "ID do usuário é obrigatório!" });
  }

  const sql = `SELECT (chamado_id, chamado_usuario_id, chamado_status_id, chamado_motivo, chamado_data_abertura, chamado_data_fechamento) FROM chamados WHERE chamado_usuario_id = ?`;

  db.query(sql, [usuario_id], (err, results) => {
    if (err) {
      console.log("Erro ao buscar chamados por usuário: ", err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar chamados por usuário." });
    }
    res.status(200).json(results);
  });
};

export const getChamadosSetor = (req, res) => {
  const setor_id = req.params.id;

  if (!setor_id) {
    return res.status(400).json({ message: "ID do setor é obrigatório!" });
  }

  const sql = `SELECT (chamado_id, chamado_usuario_id, chamado_status_id, chamado_motivo, chamado_data_abertura, chamado_data_fechamento) FROM chamados WHERE chamado_setor_id = ?`;

  db.query(sql, [setor_id], (err, results) => {
    if (err) {
      console.log("Erro ao buscar chamados por setor: ", err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar chamados por setor." });
    }
    res.status(200).json(results);
  });
};

// PUTS

export const putStatusChamado = (req, res) => {
  const chamado_id = req.params.id;
  const chamado_status_id = req.params.status;

  const sql = `UPDATE chamados SET chamado_status_id = ? 
                 WHERE chamado_id = ?`;

  db.query(sql, [chamado_status_id, chamado_id], (err, results) => {
    if (err) {
      console.log("Erro ao modificar status do chamado: ", err);
      return res
        .status(500)
        .json({ error: "Erro ao modificar status do chamado." });
    }
    res
      .status(200)
      .json({ message: "Status do chamado modificado com sucesso!" });
  });
};

export const putPrioridadeChamado = (req, res) => {
  const chamado_id = req.params.id;
  const chamado_prioridade_id = req.params.prioridade;

  if (!chamado_prioridade_id) {
    return res
      .status(400)
      .json({ message: "Prioridade do chamado é obrigatória!" });
  }

  const sql = `UPDATE chamados SET chamado_prioridade_id = ? 
                 WHERE chamado_id = ?`;

  db.query(sql, [chamado_prioridade_id, chamado_id], (err, results) => {
    if (err) {
      console.log("Erro ao modificar prioridade do chamado: ", err);
      return res
        .status(500)
        .json({ error: "Erro ao modificar prioridade do chamado." });
    }
    res
      .status(200)
      .json({ message: "Prioridade do chamado modificada com sucesso!" });
  });
};

export const putImpactoChamado = (req, res) => {
  const chamado_id = req.params.id;
  const chamado_impacto_id = req.params.impacto;

  if (!chamado_impacto_id) {
    return res
      .status(400)
      .json({ message: "Impacto do chamado é obrigatório!" });
  }

  const sql = `UPDATE chamados SET chamado_impacto_id = ? 
                 WHERE chamado_id = ?`;

  db.query(sql, [chamado_impacto_id, chamado_id], (err, results) => {
    if (err) {
      console.log("Erro ao modificar impacto do chamado: ", err);
      return res
        .status(500)
        .json({ error: "Erro ao modificar impacto do chamado." });
    }
    res
      .status(200)
      .json({ message: "Impacto do chamado modificado com sucesso!" });
  });
};

export const putResponsavelChamado = (req, res) => {
  const chamado_id = req.params.id;
  const chamado_responsavel_id = req.params.responsavel;

  if (!chamado_responsavel_id) {
    return res
      .status(400)
      .json({ message: "Responsável do chamado é obrigatório!" });
  }

  const sql = `UPDATE chamados SET chamado_responsavel_id = ? 
                 WHERE chamado_id = ?`;

  db.query(sql, [chamado_responsavel_id, chamado_id], (err, results) => {
    if (err) {
      console.log("Erro ao modificar responsável do chamado: ", err);
      return res
        .status(500)
        .json({ error: "Erro ao modificar responsável do chamado." });
    }
    res
      .status(200)
      .json({ message: "Responsável do chamado modificado com sucesso!" });
  });
};

export const putTipoChamado = (req, res) => {
  const chamado_id = req.params.id;
  const chamado_tipo_id = req.params.tipo;

  if (!chamado_tipo_id) {
    return res.status(400).json({ message: "Tipo do chamado é obrigatório!" });
  }

  const sql = `UPDATE chamados SET chamado_tipo_id = ? 
                 WHERE chamado_id = ?`;

  db.query(sql, [chamado_tipo_id, chamado_id], (err, results) => {
    if (err) {
      console.log("Erro ao modificar tipo do chamado: ", err);
      return res
        .status(500)
        .json({ error: "Erro ao modificar tipo do chamado." });
    }
    res
      .status(200)
      .json({ message: "Tipo do chamado modificado com sucesso!" });
  });
};

export const putPrazoChamado = (req, res) => {
  const chamado_id = req.params.id;
  const chamado_prazo = req.body.chamado_prazo;

  if (!chamado_prazo) {
    return res.status(400).json({ message: "Prazo do chamado é obrigatório!" });
  }

  const sql = `UPDATE chamados SET chamado_prazo = ? 
                 WHERE chamado_id = ?`;

  db.query(sql, [chamado_prazo, chamado_id], (err, results) => {
    if (err) {
      console.log("Erro ao modificar prazo do chamado: ", err);
      return res
        .status(500)
        .json({ error: "Erro ao modificar prazo do chamado." });
    }
    res
      .status(200)
      .json({ message: "Prazo do chamado modificado com sucesso!" });
  });
};

export const finalizaChamado = (req, res) => {
  const chamado_id = req.params.id;

  if (!chamado_id) {
    return res.status(400).json({ message: "ID do chamado é obrigatório!" });
  }

  const sql = `UPDATE chamados SET chamado_status_id = 5 
                 WHERE chamado_id = ?`;

  const sql2 = `UPDATE chamados SET chamado_data_fechamento = NOW()
                 WHERE chamado_id = ?`;

  db.query(sql, [chamado_id], (err, results) => {
    if (err) {
      console.log("Erro ao finalizar status do chamado: ", err);
      return res
        .status(500)
        .json({ error: "Erro ao finalizar status do chamado." });
    }
  });
  db.query(sql2, [chamado_id], (err, results) => {
    if (err) {
      console.log("Erro ao atualizar data de fechamento do chamado: ", err);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar data de fechamento do chamado." });
    }
    res.status(200).json({ message: "Chamado finalizado com sucesso!" });
  });
};

// POST

export const postChamado = (req, res) => {
  const {
    chamado_usuario_id,
    chamado_setor_id,
    chamado_categoria_id,
    chamado_tipo,
    chamado_motivo,
    chamado_descricao,
  } = req.body;

  if (
    !chamado_usuario_id ||
    !chamado_setor_id ||
    !chamado_categoria_id ||
    !chamado_tipo ||
    !chamado_motivo ||
    !chamado_descricao
  ) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  const sql = `INSERT INTO chamados (chamado_usuario_id, chamado_setor_id, chamado_categoria_id, chamado_status, chamado_tipo, chamado_motivo, chamado_descricao, chamado_data_abertura)
                 VALUES (?, ?, ?, 1, ?, ?, ?, NOW())`;

  db.query(
    sql,
    [
      chamado_usuario_id,
      chamado_setor_id,
      chamado_categoria_id,
      chamado_tipo,
      chamado_motivo,
      chamado_descricao,
    ],
    (err, results) => {
      if (err) {
        console.log("Erro ao abrir chamado: ", err);
        return res.status(500).json({ error: "Erro ao abrir chamado." });
      }
      res.status(201).json({ message: "Chamado aberto com sucesso!" });
    }
  );
};
