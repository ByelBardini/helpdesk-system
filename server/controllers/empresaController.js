import db from "./../config/db.js";

// GETS
export const buscaDadosEmpresa = (req, res) => {
  const empresaId = req.params.id;

  const sql = `SELECT empresa_cor, empresa_imagem FROM empresas WHERE empresa_id = ?`;

  db.query(sql, [empresaId], (err, results) => {
    if (err) {
      console.log("Erro ao buscar dados da empresa: ", err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar dados da empresa." });
    }
    const empresa = {
      empresa_cor: results[0].empresa_cor,
      empresa_imagem: results[0].empresa_imagem,
    };
    res.status(200).json(empresa);
  });
};

//POST
export const postEmpresa = (req, res) => {
  const { empresa_nome, empresa_cor } = req.body;
  const empresa_imagem = req.file?.buffer;

  if (!empresa_nome || !empresa_cor || !empresa_imagem) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  const sql = `INSERT INTO empresas (empresa_nome, empresa_cor, empresa_imagem) VALUES ?(?, ?, ?)`;

  db.query(sql, [empresa_nome, empresa_cor, empresa_imagem], (err, results) => {
    if (err) {
      console.log("Erro ao criar empresa: ", err);
      return res.status(500).json({ error: "Erro ao criar empresa." });
    }
    res.status(201).json({ message: "Empresa criada com sucesso!" });
  });
};