import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Chamados extends Model {}

Chamados.init(
  {
    chamado_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    chamado_empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chamado_setor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chamado_usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chamado_area_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chamado_data_abertura: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    chamado_status: {
      type: DataTypes.ENUM(
        "em aberto",
        "visualizado",
        "resolvendo",
        "resolvido"
      ),
      allowNull: false,
    },
    chamado_tipo: {
      type: DataTypes.ENUM("erro", "solicitacao", "melhoria"),
      allowNull: false,
    },
    chamado_motivo: {
      type: DataTypes.STRING(75),
      allowNull: false,
    },
    chamado_descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    chamado_data_conclusao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    chamado_prioridade: {
      type: DataTypes.ENUM("baixa", "media", "alta", "urgente"),
      allowNull: true,
    },
    chamado_responsavel_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Chamado",
    tableName: "chamados",
    timestamps: false,
  }
);

export default Chamados;
