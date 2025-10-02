/* eslint-disable react-hooks/exhaustive-deps */
import VisualizaChamado from "../components/chamados/VisualizaChamado.jsx";
import ListaChamados from "../components/chamados/ListaChamados.jsx";
import Notificacao from "../components/default/Notificacao.jsx";
import Loading from "../components/default/Loading.jsx";
import Confirmacao from "../components/default/Confirmacao.jsx";
import { formatToCapitalized } from "brazilian-values";
import { ArrowLeft, Users, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { getChamados } from "../services/api/chamadosServices.js";
import { useNavigate } from "react-router-dom";
import { tratarErro } from "../components/default/funcoes.js";
import { socket } from "../services/socket.js";

export default function Chamados() {
  const navigate = useNavigate();

  const [modo, setModo] = useState("meus");
  const [selecionado, setSelecionado] = useState(null);

  const [meus, setMeus] = useState([]);
  const [liderados, setLiderados] = useState([]);

  const [chamados, setChamados] = useState([]);

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

  async function buscarChamados() {
    setLoading(true);
    try {
      const role = localStorage.getItem("usuario_role");
      let id;
      if (role == "liderado") {
        id = localStorage.getItem("usuario_id");
      } else if (role == "supervisor") {
        id = localStorage.getItem("setor_id");
      } else {
        id = localStorage.getItem("empresa_id");
      }
      const chamados = await getChamados(role, id);

      if (role != "liderado") {
        setLoading(false);
        console.log(chamados);
        const meus = chamados.filter(
          (chamado) =>
            chamado.chamado_usuario_id == localStorage.getItem("usuario_id")
        );
        setMeus(meus);
        setChamados(meus);

        setLiderados(
          chamados.filter(
            (chamado) =>
              chamado.chamado_usuario_id != localStorage.getItem("usuario_id")
          )
        );
      } else {
        setLoading(false);

        setChamados(chamados);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  function statusBadge(status) {
    const cores = {
      "em aberto": "bg-red-500/20 text-red-400",
      visualizado: "bg-yellow-500/20 text-yellow-400",
      resolvendo: "bg-blue-500/20 text-blue-400",
      resolvido: "bg-green-500/20 text-green-400",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${cores[status]}`}
      >
        {formatToCapitalized(status)}
      </span>
    );
  }

  useEffect(() => {
    socket.on("chamado:update", buscarChamados);
    socket.on("chamado:end", buscarChamados);
    return () => {
      socket.off("chamado:update", buscarChamados);
      socket.off("chamado:end", buscarChamados);
    };
  }, []);

  useEffect(() => {
    buscarChamados();
  }, []);

  useEffect(() => {
    if (modo === "meus") {
      setChamados(meus);
    } else {
      setChamados(liderados);
    }
  }, [modo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-6 lg:p-10 relative">
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
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/home", { replace: true })}
            className="cursor-pointer flex items-center gap-2 rounded-xl bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 px-4 py-2 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <h1 className="text-2xl font-bold">Chamados</h1>
        </div>

        {localStorage.getItem("usuario_role") != "liderado" && (
          <div className="flex gap-2">
            <button
              onClick={() => setModo("meus")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition ${
                modo === "meus"
                  ? "bg-[#6bb7ff]/30 text-[#6bb7ff]"
                  : "bg-[#2a2d5a] hover:bg-[#343765] text-white/70"
              }`}
            >
              <FileText className="inline h-4 w-4 mr-1" />
              Meus
            </button>
            <button
              onClick={() => setModo("liderados")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition ${
                modo === "liderados"
                  ? "bg-[#6bb7ff]/30 text-[#6bb7ff]"
                  : "bg-[#2a2d5a] hover:bg-[#343765] text-white/70"
              }`}
            >
              <Users className="inline h-4 w-4 mr-1" />
              Liderados
            </button>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto flex h-[80vh] rounded-2xl overflow-hidden shadow-lg bg-[#2a2d5a]/60 backdrop-blur-sm">
        <ListaChamados
          setLoading={setLoading}
          setNotificacao={setNotificacao}
          navigate={navigate}
          modo={modo}
          buscarChamados={buscarChamados}
          chamados={chamados}
          setSelecionado={setSelecionado}
          statusBadge={statusBadge}
          selecionado={selecionado}
        />

        <VisualizaChamado
          setLoading={setLoading}
          setNotificacao={setNotificacao}
          navigate={navigate}
          setConfirmacao={setConfirmacao}
          buscarChamados={buscarChamados}
          setSelecionado={setSelecionado}
          selecionado={selecionado}
          statusBadge={statusBadge}
        />
      </div>
    </div>
  );
}
