import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Usuario extends Model {}

Usuario.init(
  {
    usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    usuario_setor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuario_empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuario_caminho_foto: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    usuario_nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    usuario_login: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    usuario_senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    usuario_role: {
      type: DataTypes.ENUM("adm", "gerente", "supervisor", "liderado"),
      allowNull: false,
    },
    usuario_ativo: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    usuario_troca_senha: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: false,
  }
);

export default Usuario;
