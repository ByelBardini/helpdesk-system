import jwt from "jsonwebtoken";
import db from "./../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const CHAVE = process.env.SECERET_KEY_LOGIN;

export const login = (req, res) => {
  const { senha_usuario, login_usuario } = req.body;

  if (!senha_usuario || !login_usuario) {
    return res.status(400).json({ message: "Necessário login e senha!" });
  }
  const sql = `SELECT usuario_id, usuario_empresa_id, usuario_setor_id, usuario_nome, usuario_senha_hash, usuario_role FROM usuarios WHERE usuario_login = ? AND usuario_ativo = 1`;
  db.query(sql, [login_medico], (err, results) => {
    if (err) {
      console.log("Erro na consulta: ", err);
      return res.status(500).json({ error: "Erro ao validar usuário." });
    }
    if (results.length === 0) {
      console.log("Não encontrado nenhum usuário");
      return res.status(401).json({ message: "Login inválido!" });
    }
    if (results.length > 0) {
      bcrypt.compare(
        senha_usuario,
        results[0].usuario_senha_hash,
        (err, match) => {
          if (err) {
            console.log("Erro ao comparar senhas: ", err);
          }
          if (match) {
            // Token de usuário
            const dadosUsuario = {
              usuario_empresa_id: results[0].usuario_empresa_id,
              usuario_setor_id: results[0].usuario_setor_id,
              usuario_nome: results[0].usuario_nome,
            };
            const token = jwt.sign(
              {
                usuario_id: results[0].usuario_id,
                usuario_role: results[0].usuario_role,
              },
              CHAVE,
              { expiresIn: "2h" }
            );
            res
              .cookie("token", token, {
                httpOnly: true,
                sameSite: "Lax",
                secure: false,
                path: "/",
              })
              .status(200)
              .json(dadosUsuario);
          } else {
            res.status(401).json({ message: "Usuário ou senha inválidos!" });
          }
        }
      );
    }
  });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ mensagem: "Logout realizado com sucesso!" });
};
