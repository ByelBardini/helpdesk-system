import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Compra extends Model {}

Compra.init(
  {
    compra_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    compra_empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    compra_setor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    compra_solicitante_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    compra_item: {
      type: DataTypes.STRING(75),
      allowNull: false,
    },
    compra_tipo: {
      type: DataTypes.ENUM("produto", "servico"),
      allowNull: false,
    },
    compra_quantidade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    compra_motivo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    compra_data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    compra_status: {
      type: DataTypes.ENUM("em analise", "aprovado", "recusado"),
      allowNull: false,
    },
    compra_valor: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    compra_recebida: {
      type: DataTypes.ENUM("a caminho", "recebido"),
      allowNull: true,
    },
    compra_data_recebimento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    compra_motivo_recusa: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Compra",
    tableName: "compras",
    timestamps: false,
  }
);

export default Compra;
