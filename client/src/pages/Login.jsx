import Logo from "../assets/logo-empresa.png";
import Notificacao from "../components/default/Notificacao.jsx";
import Loading from "../components/default/Loading.jsx";
import { login } from "../services/auth/authService.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [notificacao, setNotificacao] = useState({
    show: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function logarSistema() {
    if (!senha || !usuario) {
      setNotificacao({
        show: true,
        tipo: "erro",
        titulo: "Dados incompletos",
        mensagem: "Login e senha são necessários para logar no sistema",
      });
      return;
    }

    setLoading(true);
    try {
      const dados = await login(senha, usuario);
      setNotificacao({
        show: true,
        tipo: "sucesso",
        titulo: "Sucesso",
        mensagem: "Login realizado com sucesso! Redirecionando...",
      });

      setTimeout(() => {
        setNotificacao({
          show: false,
          tipo: "sucesso",
          titulo: "",
          mensagem: "",
        });
        if (["adm", "suporte"].includes(dados.usuario_role)) {
          navigate("/suporte/dashboard", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      }, 1200);
    } catch (err) {
      const apiMessage = err.response?.data?.message || "";
      let titulo = "Erro";
      let mensagem = "Falha ao realizar login";

      if (apiMessage.includes("obrigatórios")) {
        titulo = "Dados incompletos";
        mensagem = "Login e senha são necessários para logar no sistema";
      } else if (apiMessage.includes("Login incorreto")) {
        titulo = "Login Inválido";
        mensagem = "Usuário não encontrado no sistema";
      } else if (apiMessage.includes("Usuário inativo")) {
        titulo = "Usuário inativo";
        mensagem = "Fale com um administrador do sistema";
      } else if (apiMessage.includes("Senha incorreta")) {
        titulo = "Senha incorreta";
        mensagem = "Verifique a digitação e tente novamente";
      }

      setNotificacao({ show: true, tipo: "erro", titulo, mensagem });
    } finally {
      setLoading(false);
    }
  }

  function enter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      logarSistema();
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-5 relative overflow-hidden">
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

      <div className="absolute inset-0 bg-[#0e1033]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffb86b] via-[#14163d] to-[#0e1033] opacity-40"></div>

        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-[200%] h-[40%] -rotate-45 
      bg-gradient-to-r from-transparent via-[#6bb7ff40] to-transparent 
      blur-3xl"
          ></div>
        </div>
      </div>

      <div className="lg:col-span-2 flex items-center justify-center px-6 py-12 z-10">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-center text-white drop-shadow-md">
              Acesso ao Sistema
            </h2>
            <p className="mt-1 text-sm text-center text-white/60">
              Entre com suas credenciais
            </p>

            <div className="mt-8 space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-white/80">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" />
                  <input
                    onChange={(e) => setUsuario(e.target.value)}
                    id="email"
                    type="email"
                    placeholder="voce@empresa.com"
                    className="w-full pl-10 rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#6bb7ff]/40 focus:border-[#6bb7ff]/40 placeholder:text-white/50"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-white/80">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" />
                  <input
                    onChange={(e) => setSenha(e.target.value)}
                    onKeyDown={enter}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-[#ff6b98]/40 focus:border-[#ff6b98]/40 placeholder:text-white/50"
                  />
                </div>
              </div>

              {/* Botão */}
              <button
                onClick={logarSistema}
                className="cursor-pointer w-full rounded-xl py-3 font-semibold shadow-xl transition transform bg-gradient-to-r from-[#ffb86b] via-[#ff6b98] to-[#6bb7ff] hover:opacity-95 hover:scale-[1.02] active:scale-[.98] text-white"
              >
                Entrar
              </button>

              <p className="text-center text-sm text-white/60 mt-4">
                Para conseguir seu login, fale com o seu supervisor
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coluna lateral */}
      <div className="lg:col-span-3 hidden lg:flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center px-10">
          <img
            src={Logo}
            alt="Logo SubmIT"
            className="h-60 mb-8 drop-shadow-2xl"
          />
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
            Bem-vindo ao SubmIT
          </h1>
          <p className="mt-4 text-white/70 max-w-md">
            Sistema de chamados de TI — simples, rápido e eficiente
          </p>
        </div>
      </div>
    </div>
  );
}
