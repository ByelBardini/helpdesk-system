/* eslint-disable no-unused-vars */
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

function BotaoMenu({ onClick, icon: Icon, label, cor = "text-blue-300" }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 
                 bg-[#14163d]/60 hover:bg-[#1c1f4a]/80 
                 border border-white/10 rounded-xl 
                 text-white/80 font-medium transition"
    >
      <Icon className={`h-5 w-5 ${cor}`} />
      <span className="text-sm">{label}</span>
    </button>
  );
}

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
<div className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-5 bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] relative pl-6 pr-6 gap-6 text-white custom-scrollbar">
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

      {/* Lado Esquerdo - Logo, Bem-vindo e Botões */}
      <div className="flex flex-col items-center justify-center gap-6 h-screen">
        <img
          src={Logo}
          alt="Logo SubmIT"
          className="h-25 object-contain drop-shadow-md"
        />

        <h1
          className="text-lg font-bold text-center 
                     bg-gradient-to-r from-[#ffb86b] via-[#ff6b98] to-[#6bb7ff] 
                     bg-clip-text text-transparent drop-shadow"
        >
          {`Bem-Vindo(a) ${localStorage.getItem("usuario_nome")}`}
        </h1>

        <div className="flex flex-col gap-3 w-full mt-2">
          <BotaoMenu
            onClick={() => navigate("/novo-chamado", { replace: true })}
            icon={CalendarPlus}
            label="Novo Chamado"
            cor="text-green-300"
          />

          {localStorage.getItem("usuario_role") != "liderado" &&
            localStorage.getItem("usuario_role") != "suporte" && (
              <BotaoMenu
                onClick={() => navigate("/compras", { replace: true })}
                icon={ShoppingCart}
                label="Solicitações de Compras"
                cor="text-blue-300"
              />
            )}

          <BotaoMenu
            onClick={() => navigate("/chamados", { replace: true })}
            icon={FileText}
            label="Visualizar Chamados"
            cor="text-yellow-300"
          />

          <BotaoMenu
            onClick={() => navigate("/faq", { replace: true })}
            icon={HelpCircle}
            label="FAQ"
            cor="text-purple-300"
          />

          {(localStorage.getItem("usuario_role") == "adm" ||
            localStorage.getItem("usuario_role") == "suporte") && (
            <BotaoMenu
              onClick={() => navigate("/suporte/dashboard", { replace: true })}
              icon={LayoutDashboard}
              label="Dashboard"
              cor="text-pink-300"
            />
          )}

          <BotaoMenu
            onClick={logout}
            icon={LogOut}
            label="Sair"
            cor="text-red-300"
          />
        </div>
      </div>

      {/* Lado Direito - Avisos */}
      <div className="lg:col-span-4 flex flex-col h-screen gap-6 border-l-2 border-white/10">
        <ListaAvisos avisos={avisos} />
      </div>
    </div>
  );
}
