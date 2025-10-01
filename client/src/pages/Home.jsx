/* eslint-disable react-hooks/exhaustive-deps */
import Logo from "../assets/logo-empresa.png";
import ListaAvisos from "../components/avisos/ListaAvisos.jsx";
import Notificacao from "../components/default/Notificacao.jsx";
import Loading from "../components/default/Loading.jsx";
import {
  LogOut,
  FileText,
  HelpCircle,
  CalendarPlus,
  LayoutDashboard,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { tratarErro } from "../components/default/funcoes.js";
import { getAvisos } from "../services/api/avisosServices.js";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();

  const [avisos, setAvisos] = useState([]);

  const [notificacao, setNotificacao] = useState({
    show: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);

  function logout() {
    localStorage.clear();
    navigate("/", { replace: true });
  }

  async function buscaAvisos() {
    try {
      setLoading(true);
      const avisos = await getAvisos();
      setLoading(false);
      setAvisos(avisos);
    } catch (err) {
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  useEffect(() => {
    buscaAvisos();
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5 bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] relative p-6 gap-6 text-white">
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
      {loading && <Loading />}

      <div className="flex flex-col items-center gap-6">
        <img
          src={Logo}
          alt="Logo SubmIT"
          className="h-20 w-20 object-contain drop-shadow-md"
        />

        <button
          onClick={() => navigate("/novo-chamado", { replace: true })}
          className="cursor-pointer flex flex-col items-center justify-center w-full flex-1 
                     bg-white/5 hover:bg-white/10 border border-white/10 
                     rounded-2xl p-6 transition"
        >
          <CalendarPlus className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Novo Chamado</span>
        </button>
        <button
          onClick={() => navigate("/compras", { replace: true })}
          className="cursor-pointer flex flex-col items-center justify-center w-full 
             bg-white/5 hover:bg-white/10 border border-white/10 
             rounded-2xl p-4 transition h-1/6"
        >
          <ShoppingCart className="h-6 w-6 mb-2" />
          <span className="text-sm font-medium">Solicitações de Compras</span>
        </button>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/chamados", { replace: true })}
              className="cursor-pointer flex items-center gap-2 
                         bg-white/5 hover:bg-white/10 border border-white/10
                         px-6 py-3 rounded-2xl transition"
            >
              <FileText className="h-5 w-5" />
              <span>Chamados</span>
            </button>

            <button
              onClick={() => navigate("/faq", { replace: true })}
              className="cursor-pointer flex items-center gap-2 
                         bg-white/5 hover:bg-white/10 border border-white/10
                         px-6 py-3 rounded-2xl transition"
            >
              <HelpCircle className="h-5 w-5" />
              <span>FAQ</span>
            </button>

            {(localStorage.getItem("usuario_role") == "adm" ||
              localStorage.getItem("usuario_role") == "suporte") && (
              <button
                onClick={() =>
                  navigate("/suporte/dashboard", { replace: true })
                }
                className="cursor-pointer flex items-center gap-2 
                           bg-white/5 hover:bg-white/10 border border-white/10
                           px-6 py-3 rounded-2xl transition"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
            )}
          </div>

          <h1
            className="text-2xl font-bold 
                         bg-gradient-to-r from-[#ffb86b] via-[#ff6b98] to-[#6bb7ff] 
                         bg-clip-text text-transparent drop-shadow"
          >
            {`Bem-Vindo(a) ${localStorage.getItem("usuario_nome")}`}
          </h1>

          <button
            onClick={logout}
            className="cursor-pointer flex items-center gap-2 
             bg-red-900/40 hover:bg-red-900/60 
             text-red-300 px-6 py-3 rounded-2xl 
             transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>

        <ListaAvisos avisos={avisos} />
      </div>
    </div>
  );
}
