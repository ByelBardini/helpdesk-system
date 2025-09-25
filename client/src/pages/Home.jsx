/* eslint-disable react-hooks/exhaustive-deps */
import Logo from "../assets/logo-empresa.png";
import ListaAvisos from "../components/avisos/ListaAvisos.jsx";
import Notificacao from "../components/default/Notificacao.jsx";
import Loading from "../components/default/Loading.jsx";
import { LogOut, FileText, HelpCircle, CalendarPlus } from "lucide-react";
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
          className="h-20 w-20 object-contain"
        />

        <button
          onClick={() => navigate("/novo-chamado", { replace: true })}
          className="cursor-pointer flex flex-col items-center justify-center w-full flex-1 bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 rounded-2xl p-6 transition"
        >
          <CalendarPlus className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Novo Chamado</span>
        </button>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/chamados", { replace: true })}
              className="cursor-pointer flex items-center gap-2 bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 px-6 py-3 rounded-2xl transition"
            >
              <FileText className="h-5 w-5" />
              <span>Chamados</span>
            </button>

            <button
              onClick={() => navigate("/faq", { replace: true })}
              className="cursor-pointer flex items-center gap-2 bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 px-6 py-3 rounded-2xl transition"
            >
              <HelpCircle className="h-5 w-5" />
              <span>FAQ</span>
            </button>
          </div>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ffb86b] via-[#ff6b98] to-[#6bb7ff] bg-clip-text text-transparent">
            {`Bem-Vindo(a) ${localStorage.getItem("usuario_nome")}`}
          </h1>

          <button
            onClick={logout}
            className="cursor-pointer flex items-center gap-2 bg-red-600 hover:bg-red-500 px-5 py-2 rounded-full text-sm font-medium transition"
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
