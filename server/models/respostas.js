import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Resposta extends Model {}

Resposta.init(
  {
    resposta_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    resposta_chamado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resposta_usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resposta_descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    resposta_tipo: {
      type: DataTypes.ENUM("suporte", "usuario"),
      allowNull: false,
    },
    resposta_visualizada: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    resposta_data_emissao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Resposta",
    tableName: "respostas",
    timestamps: false,
  }
);

export default Resposta;
