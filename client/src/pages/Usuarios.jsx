import CardUsuario from "../components/usuarios/CardUsuario.jsx";
import FiltrosUsuarios from "../components/usuarios/FiltrosUsuarios.jsx";
import { Users, UserCog, Shield, Headset, UserCheck, Plus } from "lucide-react";
import { getUsuarios } from "../services/api/usuarioServices.js";
import { useState, useEffect } from "react";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(null);
  const [categoria, setCategoria] = useState("adms");

  const [buscaFiltro, setBuscaFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [empresaFiltro, setEmpresaFiltro] = useState("todas");
  const [setorFiltro, setSetorFiltro] = useState("todos");

  const secoes = [
    { titulo: "Administradores", chave: "adms", icone: Shield },
    { titulo: "Gerentes", chave: "gerentes", icone: UserCog },
    { titulo: "Supervisores", chave: "supervisores", icone: UserCheck },
    { titulo: "Suportes", chave: "suportes", icone: Headset },
    { titulo: "Liderados", chave: "liderados", icone: Users },
  ];

  async function buscaUsuarios() {
    try {
      const dados = await getUsuarios();
      setUsuarios(dados);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  }

  useEffect(() => {
    buscaUsuarios();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
      <div className="w-full flex flex-col bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 self-start">
        {secoes.map((secao) => (
          <button
            key={secao.chave}
            onClick={() => setCategoria(secao.chave)}
            className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-left transition ${
              categoria === secao.chave
                ? "bg-blue-500/20 border border-blue-400/30 text-blue-300"
                : "hover:bg-white/5 text-gray-300"
            }`}
          >
            <secao.icone className="w-5 h-5" />
            <span>{secao.titulo}</span>
          </button>
        ))}
      </div>

      <div className="lg:col-span-4 flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6 self-start max-h-screen">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <FiltrosUsuarios
            usuarios={usuarios}
            setBuscaFiltro={setBuscaFiltro}
            setStatusFiltro={setStatusFiltro}
            setEmpresaFiltro={setEmpresaFiltro}
            setSetorFiltro={setSetorFiltro}
          />

          <button className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-400/30 hover:bg-green-500/30 transition text-sm">
            <Plus className="w-4 h-4" />
            <span>Novo Funcionário</span>
          </button>
        </div>
        <div className="max-h-screen overflow-auto">
          {!usuarios ? (
            <p className="text-gray-400">Carregando usuários...</p>
          ) : (
            <div className="space-y-3">
              {usuarios[categoria]
                ?.filter(
                  (u) =>
                    u.usuario_nome
                      .toLowerCase()
                      .includes(buscaFiltro.toLowerCase()) ||
                    u.usuario_login
                      .toLowerCase()
                      .includes(buscaFiltro.toLowerCase())
                )
                .filter((u) =>
                  statusFiltro === "todos"
                    ? true
                    : statusFiltro === "ativos"
                    ? u.usuario_ativo
                    : !u.usuario_ativo
                )
                .filter((u) =>
                  empresaFiltro === "todas"
                    ? true
                    : u.empresa?.empresa_nome === empresaFiltro
                )
                .filter((u) =>
                  setorFiltro === "todos"
                    ? true
                    : u.setor?.setor_nome === setorFiltro
                ).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-white/5 border border-white/10 rounded-xl">
                  <Users className="w-10 h-10 text-gray-500 mb-3" />
                  <p className="text-gray-400 font-medium">
                    Nenhum usuário encontrado
                  </p>
                  <span className="text-xs text-gray-500">
                    Tente ajustar os filtros ou adicionar um novo funcionário
                  </span>
                </div>
              ) : (
                usuarios[categoria]
                  ?.filter(
                    (u) =>
                      u.usuario_nome
                        .toLowerCase()
                        .includes(buscaFiltro.toLowerCase()) ||
                      u.usuario_login
                        .toLowerCase()
                        .includes(buscaFiltro.toLowerCase())
                  )
                  .filter((u) =>
                    statusFiltro === "todos"
                      ? true
                      : statusFiltro === "ativos"
                      ? u.usuario_ativo
                      : !u.usuario_ativo
                  )
                  .filter((u) =>
                    empresaFiltro === "todas"
                      ? true
                      : u.empresa?.empresa_nome === empresaFiltro
                  )
                  .filter((u) =>
                    setorFiltro === "todos"
                      ? true
                      : u.setor?.setor_nome === setorFiltro
                  )
                  .map((usuario) => <CardUsuario usuario={usuario} />)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
