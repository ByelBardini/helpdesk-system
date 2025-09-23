import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Anexos extends Model {}

Anexos.init(
  {
    anexo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    anexo_chamado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    anexo_nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    anexo_caminho: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Anexo",
    tableName: "anexos",
    timestamps: false,
  }
);

export default Anexos;
