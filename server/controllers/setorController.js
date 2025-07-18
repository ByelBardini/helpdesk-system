export const criaSetor = (req, res) => {
  const { setor_empresa_id, setor_nome } = req.body;

  if (!setor_empresa_id || !setor_nome) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  const sql = `INSERT INTO setores (setor_empresa_id, setor_nome_ VALUES (?, ?)`;

  db.query(sql, [setor_empresa_id, setor_nome], (err, results) => {
    if (err) {
      console.log("Erro ao criar setor: ", err);
      return res.status(500).json({ error: "Erro ao criar setor." });
    }
    res.status(201).json({ message: "Setor criado com sucesso!" });
  });
};

export const buscaSetorPorEmpresa = (req, res) => {
  const setor_empresa_id = req.params.id;

  if (!setor_empresa_id) {
    return res.status(400).json({ message: "ID da empresa é obrigatório!" });
  }
  const sql = `SELECT setor_id, setor_nome FROM setores WHERE setor_empresa_id = ?`;

  db.query(sql, [setor_empresa_id], (err, results) => {
    if (err) {
      console.log("Erro ao buscar setores: ", err);
      return res.status(500).json({ error: "Erro ao buscar setores." });
    }
    res.status(200).json(results);
  });
};
