import db from "./../config/db.js";

// GETS

export const getAgendamentos = (req, res) => {
  const id_chamado = req.params.id;

  const sql = `SELECT * FROM agendamentos WHERE agendamento_chamado_id = ?`;

  db.query(sql, [id_chamado], (err, results) => {
    if (err) {
      console.log("Erro ao buscar agendamentos: ", err);
      return res.status(500).json({ error: "Erro ao buscar agendamentos." });
    }
    res.status(200).json(results);
  });
};

// PUTS

export const putDataAgendamento = (req, res) => {
  const agendamento_id = req.params.id;
    const { agendamento_data } = req.body;
    if (!agendamento_data) {
    return res.status(400).json({ message: "Data do agendamento é obrigatória!" });
  }
    const sql = `UPDATE agendamentos SET agendamento_data = ? WHERE agendamento_id = ?`;
    db.query(sql, [agendamento_data, agendamento_id], (err, results) => {
    if (err) {
      console.log("Erro ao modificar data do agendamento: ", err);
      return res.status(500).json({ error: "Erro ao modificar data do agendamento." });
    }
    res.status(200).json({ message: "Data do agendamento modificada com sucesso!" });
    });
}

export const finalizaAgendamento = (req, res) => {
  const agendamento_id = req.params.id;
    const sql = `UPDATE agendamentos SET agendamento_status = 7, agendamento_data_conclusao = NOW() WHERE agendamento_id = ?`;
    db.query(sql, [agendamento_id], (err, results) => {
    if (err) {
      console.log("Erro ao finalizar agendamento: ", err);
      return res.status(500).json({ error: "Erro ao finalizar agendamento." });
    }
    res.status(200).json({ message: "Agendamento finalizado com sucesso!" });
    });
}

// POST

export const postAgendamento = (req, res) => {
    const { agendamento_chamado_id, agendamento_motivo, agendamento_data } = req.body;
    if (!agendamento_chamado_id || !agendamento_motivo || !agendamento_data) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
  }
    const sql = `INSERT INTO agendamentos (agendamento_chamado_id, agendamento_status_id, agendamento_motivo, agendamento_data) VALUES (?, 6, ?, ?)`;
    db.query(sql, [agendamento_chamado_id, agendamento_motivo, agendamento_data], (err, results) => {
    if (err) {
      console.log("Erro ao criar agendamento: ", err);
      return res.status(500).json({ error: "Erro ao criar agendamento." });
    }
    res.status(201).json({ message: "Agendamento criado com sucesso!" });
    });
}