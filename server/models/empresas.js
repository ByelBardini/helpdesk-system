import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Empresa extends Model {}

Empresa.init(
  {
    empresa_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    empresa_nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    empresa_cnpj: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Empresa",
    tableName: "empresas",
    timestamps: false,
  }
);

export default Empresa;
