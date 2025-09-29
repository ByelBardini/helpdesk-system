/* eslint-disable react-hooks/exhaustive-deps */
import CardUsuario from "../components/usuarios/CardUsuario.jsx";
import FiltrosUsuarios from "../components/usuarios/FiltrosUsuarios.jsx";
import ModalUsuario from "../components/usuarios/ModalUsuario.jsx";
import Notificacao from "../components/default/Notificacao.jsx";
import Loading from "../components/default/Loading.jsx";
import Confirmacao from "../components/default/Confirmacao.jsx";
import {
  Users,
  UserCog,
  Shield,
  Headset,
  UserCheck,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getUsuarios } from "../services/api/usuarioServices.js";
import { dividirEmPartes, tratarErro } from "../components/default/funcoes.js";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Usuarios() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [categoria, setCategoria] = useState("adms");

  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [usuariosOrdenados, setUsuariosOrdenados] = useState([]);

  const [sessao, setSessao] = useState(0);
  const [porPagina, setPorPagina] = useState(6);

  const [editaUsuario, setEditaUsuario] = useState({
    show: false,
    usuario: null,
  });

  const [notificacao, setNotificacao] = useState({
    show: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);
  const [confirmacao, setConfirmacao] = useState({
    show: false,
    titulo: "",
    texto: "",
    onSim: null,
  });

  const secoes = [
    { titulo: "Administradores", chave: "adms", icone: Shield },
    { titulo: "Suportes", chave: "suportes", icone: Headset },
    { titulo: "Gerentes", chave: "gerentes", icone: UserCog },
    { titulo: "Supervisores", chave: "supervisores", icone: UserCheck },
    { titulo: "Liderados", chave: "liderados", icone: Users },
  ];

  const empresas = useMemo(() => {
    if (!usuarios) return [];
    const lista = Object.values(usuarios)
      .flat()
      .map((u) => u.empresa?.empresa_nome)
      .filter(Boolean);
    return [...new Set(lista)];
  }, [usuarios]);

  const setores = useMemo(() => {
    if (!usuarios) return [];
    const lista = Object.values(usuarios)
      .flat()
      .map((u) => u.setor?.setor_nome)
      .filter(Boolean);
    return [...new Set(lista)];
  }, [usuarios]);

  function calcularPorPagina() {
    const altura = window.innerHeight;
    const header = 140;
    const footer = 100;
    const cardMedio = 90;
    const disponivel = altura - header - footer;

    const qtd = Math.max(1, Math.floor(disponivel / cardMedio));

    console.log(qtd);
    setPorPagina(qtd);
  }

  async function buscaUsuarios() {
    setLoading(true);
    try {
      const dados = await getUsuarios();
      setLoading(false);
      setUsuarios(dados);
      setUsuariosFiltrados(dados);
    } catch (err) {
      setLoading(false);
      console.error("Erro ao buscar usuários:", err);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  useEffect(() => {
    buscaUsuarios();

    calcularPorPagina();
    window.addEventListener("resize", calcularPorPagina);
    return () => window.removeEventListener("resize", calcularPorPagina);
  }, []);

  useEffect(() => {
    setSessao(0);

    const ordenados = {};
    for (const key in usuariosFiltrados) {
      ordenados[key] = dividirEmPartes(usuariosFiltrados[key], porPagina);
    }

    setUsuariosOrdenados(ordenados);

    setUsuariosOrdenados(ordenados);
  }, [usuariosFiltrados]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
      {editaUsuario.show && (
        <ModalUsuario
          setores={setores}
          usuario={editaUsuario.usuario}
          setEditaUsuario={setEditaUsuario}
          buscaUsuarios={buscaUsuarios}
          navigate={navigate}
          setNotificacao={setNotificacao}
          setLoading={setLoading}
          setConfirmacao={setConfirmacao}
        />
      )}
      {notificacao.show && (
        <Notificacao
          titulo={notificacao.titulo}
          mensagem={notificacao.mensagem}
          tipo={notificacao.tipo}
          onClick={() =>
            setNotificacao({
              show: false,
              tipo: "sucesso",
              titulo: "",
              mensagem: "",
            })
          }
        />
      )}
      {confirmacao.show && (
        <Confirmacao
          texto={confirmacao.texto}
          titulo={confirmacao.titulo}
          onSim={confirmacao.onSim}
          onNao={() =>
            setConfirmacao({
              show: false,
              titulo: "",
              texto: "",
              onSim: null,
            })
          }
        />
      )}
      {loading && <Loading />}
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

      <div className="lg:col-span-4 flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6 self-start h-[calc(100vh-6rem)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <FiltrosUsuarios
            usuarios={usuarios}
            categoria={categoria}
            setUsuariosFiltrados={setUsuariosFiltrados}
            empresas={empresas}
            setores={setores}
          />

          <button className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-400/30 hover:bg-green-500/30 transition text-sm">
            <Plus className="w-4 h-4" />
            <span>Novo Funcionário</span>
          </button>
        </div>
        <div className="max-h-screen ">
          {usuariosOrdenados[categoria]?.[sessao]?.length > 0 ? (
            usuariosOrdenados[categoria][sessao].map((usuario) => (
              <CardUsuario
                key={usuario.usuario_id}
                usuario={usuario}
                setEditaUsuario={setEditaUsuario}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-white/5 border border-white/10 rounded-xl">
              <Users className="w-10 h-10 text-gray-500 mb-3" />
              <p className="text-gray-400 font-medium">
                Nenhum usuário encontrado
              </p>
              <span className="text-xs text-gray-500">
                Tente ajustar os filtros ou adicionar um novo funcionário
              </span>
            </div>
          )}
          {usuariosOrdenados[categoria]?.length > 1 && (
            <div className="w-full fixed bottom-4 left-50 flex items-center justify-center pb-4 z-2">
              <div className="flex items-center gap-4 px-6 py-2 rounded-xl bg-[#2a2d5a]/90 shadow-lg backdrop-blur-sm">
                <button
                  disabled={sessao === 0}
                  onClick={() => setSessao((prev) => prev - 1)}
                  className="cursor-pointer p-2 rounded-lg bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 text-white/80 disabled:opacity-40 disabled:cursor-default transition"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="text-sm font-medium text-white/80">
                  Página <span className="text-[#6bb7ff]">{sessao + 1}</span> de{" "}
                  <span className="text-[#6bb7ff]">
                    {usuariosOrdenados[categoria]?.length || 1}
                  </span>
                </span>

                <button
                  disabled={
                    sessao === (usuariosOrdenados[categoria]?.length || 1) - 1
                  }
                  onClick={() => setSessao((prev) => prev + 1)}
                  className="cursor-pointer p-2 rounded-lg bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 text-white/80 disabled:opacity-40 disabled:cursor-default transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
