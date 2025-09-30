import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Areas extends Model {}

Areas.init(
  {
    area_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    area_nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    area_tipo: {
      type: DataTypes.ENUM("erro", "solicitacao", "melhoria"),
      allowNull: false,
    },
    area_ativa: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "Area",
    tableName: "areas",
    timestamps: false,
  }
);

export default Areas;
