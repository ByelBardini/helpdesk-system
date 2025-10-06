/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import Logo from "../assets/logo-empresa.png";
import ListaAvisos from "../components/avisos/ListaAvisos.jsx";
import Notificacao from "../components/default/Notificacao.jsx";
import Loading from "../components/default/Loading.jsx";
import ModalPrimeiroAcesso from "../components/usuarios/ModalPrimeiroAcesso.jsx";
import {
  LogOut,
  FileText,
  HelpCircle,
  CalendarPlus,
  LayoutDashboard,
  ShoppingCart,
  Bell,
} from "lucide-react";
import { logout } from "../services/auth/authService.js";
import { useNavigate } from "react-router-dom";
import { tratarErro } from "../components/default/funcoes.js";
import { getAvisos } from "../services/api/avisosServices.js";
import { useEffect, useState } from "react";
import { getNotificacoesChamadoUsuario } from "../services/api/notificacaoServices.js";
import { socket } from "../services/socket.js";
import {
  requestPermission,
  isPermissionGranted,
  sendNotification,
} from "@tauri-apps/plugin-notification";

function BotaoMenu({ onClick, icon: Icon, label, cor = "text-blue-300" }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 
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
  const [qtdNotif, setQtdNotif] = useState([]);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(false);

  const [trocaSenha, setTrocaSenha] = useState(
    localStorage.getItem("usuario_troca_senha") == "1"
  );
  const [notificacao, setNotificacao] = useState({
    show: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);

  async function deslogar() {
    await logout();
    localStorage.clear();
    navigate("/", { replace: true });
  }

  async function buscaNotificacoes() {
    try {
      const qtd = await getNotificacoesChamadoUsuario(
        localStorage.getItem("usuario_id")
      );

      setQtdNotif(qtd.respostas[0].total);
    } catch (err) {
      console.error(err);
    }
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

  async function verificarPermissaoNotificacoes() {
    try {
      const granted = await isPermissionGranted();
      if (granted) {
        setNotificacoesAtivas(true);
      } else {
        setNotificacoesAtivas(false);
      }
    } catch (error) {
      console.error("Erro ao verificar permissões de notificação:", error);
    }
  }

  async function permitirNotificacoes() {
    const granted = await isPermissionGranted();
    if (granted) {
      setNotificacoesAtivas(true);
      sendNotification({
        title: "Notificações ativadas",
        body: "Você receberá alertas mesmo com o app em segundo plano.",
      });
      return;
    }

    const permission = await requestPermission();
    if (permission === "granted") {
      setNotificacoesAtivas(true);
      sendNotification({
        title: "Notificações Ativadas",
        body: "Permissão concedida com sucesso!",
      });
    } else {
      setNotificacoesAtivas(false);
      setNotificacao({
        show: true,
        tipo: "erro",
        titulo: "Permissão negada",
        mensagem:
          "Você negou as notificações. Pode ativar novamente nas configurações do sistema.",
      });
    }
  }

  useEffect(() => {
    buscaAvisos();
    buscaNotificacoes();
    verificarPermissaoNotificacoes();

    socket.on("reply:new", buscaNotificacoes);
    return () => {
      socket.off("reply:new", buscaNotificacoes);
    };
  }, []);

  return (
    <div className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-5 bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] relative pl-6 pr-6 gap-6 text-white custom-scrollbar">
      {trocaSenha && (
        <ModalPrimeiroAcesso
          setNotificacao={setNotificacao}
          setLoading={setLoading}
          navigate={navigate}
          setTrocaSenha={setTrocaSenha}
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

          <div className="relative inline-block">
            <BotaoMenu
              onClick={() => navigate("/chamados", { replace: true })}
              icon={FileText}
              label="Visualizar Chamados"
              cor="text-yellow-300"
            />
            {qtdNotif > 0 && (
              <span
                className="absolute -top-2 -right-2 
                 bg-red-500 text-white text-[11px] font-bold
                 rounded-full w-5 h-5 flex items-center justify-center
                 shadow-md"
              >
                {qtdNotif >= 10 ? "9+" : qtdNotif}
              </span>
            )}
          </div>

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
            onClick={permitirNotificacoes}
            icon={Bell}
            label={
              notificacoesAtivas
                ? "Notificações Ativadas"
                : "Permitir Notificações"
            }
            cor={notificacoesAtivas ? "text-green-300" : "text-blue-300"}
          />

          <BotaoMenu
            onClick={deslogar}
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
