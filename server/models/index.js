import Usuario from "./usuarios.js";
import Empresa from "./empresas.js";
import Setor from "./setores.js";
import Pergunta from "./faq.js";
import Aviso from "./avisos.js";
import Area from "./areas.js";
import Anexo from "./anexos.js";
import Chamado from "./chamados.js";
import Resposta from "./respostas.js";

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
  onDelete: "SET NULL",
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

// Foreign keys de chamado e usuario
Usuario.hasMany(Chamado, {
  foreignKey: "chamado_usuario_id",
  sourceKey: "usuario_id",
  as: "chamados",
});
Chamado.belongsTo(Usuario, {
  foreignKey: "chamado_usuario_id",
  targetKey: "usuario_id",
  as: "usuario",
});
Usuario.hasMany(Chamado, {
  foreignKey: "chamado_responsavel_id",
  sourceKey: "usuario_id",
  as: "chamado",
});
Chamado.belongsTo(Usuario, {
  foreignKey: "chamado_responsavel_id",
  targetKey: "usuario_id",
  as: "responsavel",
});

//Foreign keys de chamado e empresa
Empresa.hasMany(Chamado, {
  foreignKey: "chamado_empresa_id",
  sourceKey: "empresa_id",
  as: "chamados",
});
Chamado.belongsTo(Empresa, {
  foreignKey: "chamado_empresa_id",
  targetKey: "empresa_id",
  as: "empresa",
});

//Foreign keys de chamado e setor
Setor.hasMany(Chamado, {
  foreignKey: "chamado_setor_id",
  sourceKey: "setor_id",
  as: "chamados",
});
Chamado.belongsTo(Setor, {
  foreignKey: "chamado_setor_id",
  targetKey: "setor_id",
  as: "setor",
});

//Foreign keys de chamado e area
Area.hasMany(Chamado, {
  foreignKey: "chamado_area_id",
  sourceKey: "area_id",
  as: "chamados",
});
Chamado.belongsTo(Area, {
  foreignKey: "chamado_area_id",
  targetKey: "area_id",
  as: "area",
});

//Foreign keys de anexo e chamado
Chamado.hasMany(Anexo, {
  foreignKey: "anexo_chamado_id",
  sourceKey: "chamado_id",
  as: "anexos",
});
Anexo.belongsTo(Chamado, {
  foreignKey: "anexo_chamado_id",
  targetKey: "chamado_id",
  as: "chamado",
});

//Foreign keys de resposta e chamado
Chamado.hasMany(Resposta, {
  foreignKey: "resposta_chamado_id",
  sourceKey: "chamado_id",
  as: "respostas",
});
Resposta.belongsTo(Chamado, {
  foreignKey: "resposta_chamado_id",
  targetKey: "chamado_id",
  as: "chamado",
});

//Foreign keys de resposta e usuario
Usuario.hasMany(Resposta, {
  foreignKey: "resposta_usuario_id",
  sourceKey: "usuario_id",
  as: "respostas",
});
Resposta.belongsTo(Usuario, {
  foreignKey: "resposta_usuario_id",
  targetKey: "usuario_id",
  as: "usuario",
});

//Foreign keys de resposta e anexo
Resposta.hasMany(Anexo, {
  foreignKey: "anexo_resposta_id",
  sourceKey: "resposta_id",
  as: "anexos",
});
Anexo.belongsTo(Resposta, {
  foreignKey: "anexo_resposta_id",
  targetKey: "resposta_id",
  as: "resposta",
});

export {
  Usuario,
  Empresa,
  Setor,
  Pergunta,
  Aviso,
  Area,
  Anexo,
  Chamado,
  Resposta,
};
