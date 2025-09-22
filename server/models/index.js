import Usuario from "./usuarios.js";
import Empresa from "./empresas.js";
import Setor from "./setores.js";
import Pergunta from "./faq.js";

// Foreign keys de setor e empresa
Empresa.hasMany(Setor, {
  foreignKey: "setor_empresa_id",
  sourceKey: "empresa_id",
  onDelete: "CASCADE",
  as: "setores",
});
Setor.belongsTo(Empresa, {
  foreignKey: "setor_empresa_id",
  targetKey: "empresa_id",
  onDelete: "CASCADE",
  as: "empresa",
});

// Foreign keys de usuario e setor
Setor.hasMany(Usuario, {
  foreignKey: "usuario_setor_id",
  sourceKey: "setor_id",
  as: "usuarios",
});
Usuario.belongsTo(Setor, {
  foreignKey: "usuario_setor_id",
  targetKey: "setor_id",
  as: "setor",
});

// Foreign keys de usuario e empresa
Empresa.hasMany(Usuario, {
  foreignKey: "usuario_empresa_id",
  sourceKey: "empresa_id",
  as: "usuarios",
});
Usuario.belongsTo(Empresa, {
  foreignKey: "usuario_empresa_id",
  targetKey: "empresa_id",
  as: "empresa",
});

export { Usuario, Empresa, Setor, Pergunta };
