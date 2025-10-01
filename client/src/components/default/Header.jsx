/* eslint-disable no-unused-vars */
import { useState } from "react";
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

export default function Header() {
  const [open, setOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-10 w-full bg-[#171a3f] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
        <nav className="hidden md:flex items-center gap-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${pillBase} ${isActive ? pillActive : pillIdle}`
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
                className={({ isActive }) =>
                  `${pillBase} ${isActive ? pillActive : pillIdle}`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
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
