import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Pergunta extends Model {}

Pergunta.init(
  {
    pergunta_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    pergunta_categoria: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    pergunta_titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pergunta_titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pergunta_resposta: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Pergunta",
    tableName: "faq",
    timestamps: false,
  }
);

export default Pergunta;
