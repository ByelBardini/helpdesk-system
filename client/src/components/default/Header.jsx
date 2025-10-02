/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useSyncExternalStore } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  BarChart2,
  LogOut,
  Home,
  Menu,
  UsersRound,
  Settings,
  WalletCards,
  X,
} from "lucide-react";
import {
  getNotificacoesChamadoSuporte,
  getNotificacoesCompraAdm,
} from "../../services/api/notificacaoServices";
import { socket } from "../../services/socket.js";

export default function Header() {
  const [open, setOpen] = useState(false);

  const [qtdChamado, setQtdChamado] = useState(0);
  const [qtdCompra, setQtdCompra] = useState(0);

  const navigate = useNavigate();

  const nav = [
    { to: "/suporte/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/suporte/chamados", label: "Chamados", icon: Ticket },
  ];
  const navAdm = [
    {
      to: "/suporte/compras",
      label: "Solicitações de Compra",
      icon: WalletCards,
    },
    { to: "/suporte/relatorios", label: "Relatórios", icon: BarChart2 },
    { to: "/suporte/usuarios", label: "Usuários", icon: UsersRound },
    { to: "/suporte/configuracoes", label: "Configurações", icon: Settings },
  ];

  const pillBase =
    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition";
  const pillIdle = "bg-[#2a2d5a] hover:bg-[#343765] text-white/80";
  const pillActive = "bg-[#6bb7ff]/30 text-[#6bb7ff]";

  const usuarioRole = localStorage.getItem("usuario_role");

  async function buscaNotifChamado() {
    try {
      const qtd = await getNotificacoesChamadoSuporte();
      const chamados = qtd.chamados;
      const respostas = qtd.respostas;
      setQtdChamado(chamados[0].total + respostas[0].total);
    } catch (err) {
      console.error(err);
    }
  }

  async function buscaNotifCompra() {
    try {
      const qtd = await getNotificacoesCompraAdm();
      setQtdCompra(qtd.compras[0].total);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (location.pathname.includes("/suporte/chamados")) {
      setQtdChamado(0);
    } else {
      buscaNotifChamado();
    }
    if (usuarioRole == "adm") {
      if (location.pathname.includes("/suporte/compras")) {
        setQtdCompra(0);
      } else {
        buscaNotifCompra();
        console.log(qtdCompra);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!location.pathname.includes("/suporte/chamados")) {
      socket.on("chamado:new", buscaNotifChamado);
      socket.on("reply:new", buscaNotifChamado);

      return () => {
        socket.on("chamado:new", buscaNotifChamado);
        socket.on("reply:new", buscaNotifChamado);
      };
    }
  }, []);

  return (
    <header className="sticky top-0 z-10 w-full bg-[#171a3f] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
        <nav className="hidden md:flex items-center gap-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${pillBase} ${isActive ? pillActive : pillIdle} relative`
              }
            >
              <Icon className="w-4 h-4" />
              {label}

              {label === "Chamados" && qtdChamado > 0 && (
                <span
                  className=" absolute -top-2 -right-2 
                          bg-red-500 text-white text-[11px] font-bold
                            rounded-full w-5 h-5 flex items-center justify-center
                            shadow-md "
                >
                  {qtdChamado >= 10 ? "9+" : qtdChamado}
                </span>
              )}
            </NavLink>
          ))}

          {usuarioRole === "adm" &&
            navAdm.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${pillBase} ${isActive ? pillActive : pillIdle} relative`
                }
              >
                <Icon className="w-4 h-4" />
                {label}

                {label === "Solicitações de Compra" && qtdCompra > 0 && (
                  <span
                    className=" absolute -top-2 -right-2 
                          bg-red-500 text-white text-[11px] font-bold
                            rounded-full w-5 h-5 flex items-center justify-center
                            shadow-md "
                  >
                    {qtdCompra >= 10 ? "9+" : qtdCompra}
                  </span>
                )}
              </NavLink>
            ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => navigate("/home")}
            className={`${pillBase} cursor-pointer bg-white/10 hover:bg-white/15 text-white/90`}
            title="Voltar à Home"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/", { replace: true });
            }}
            className={`${pillBase} cursor-pointer bg-red-500/20 hover:bg-red-500/30 text-red-300`}
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        <button
          className="cursor-pointer md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/15"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 px-4 pb-4 space-y-2">
          <div className="pt-3 grid grid-cols-2 gap-2">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${pillBase} ${
                    isActive ? pillActive : pillIdle
                  } justify-center`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}

            {usuarioRole === "adm" &&
              navAdm.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${pillBase} ${
                      isActive ? pillActive : pillIdle
                    } justify-center`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/home");
              }}
              className={`${pillBase} cursor-pointer bg-white/10 hover:bg-white/15 text-white/90 justify-center`}
            >
              <Home className="w-4 h-4" /> Home
            </button>
            <button
              onClick={() => {
                setOpen(false);
                localStorage.clear();
                navigate("/", { replace: true });
              }}
              className={`${pillBase} cursor-pointer bg-red-500/20 hover:bg-red-500/30 text-red-300 justify-center`}
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
