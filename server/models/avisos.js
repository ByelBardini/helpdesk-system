import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Aviso extends Model {}

Aviso.init(
  {
    aviso_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    aviso_data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    aviso_titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    aviso_descricao: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    aviso_importancia: {
      type: DataTypes.ENUM("baixa", "media", "alta"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Aviso",
    tableName: "avisos",
    timestamps: false,
  }
);

export default Aviso;
