/* eslint-disable react-hooks/exhaustive-deps */
import Notificacao from "../components/default/Notificacao.jsx";
import Loading from "../components/default/Loading.jsx";
import Confirmacao from "../components/default/Confirmacao.jsx";
import ModalPergunta from "../components/faq/ModalPergunta.jsx";
import {
  PlusCircle,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { getPerguntas, deletePergunta } from "../services/api/faqServices.js";
import { tratarErro } from "../components/default/funcoes.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Perguntas() {
  const navigate = useNavigate();

  const [perguntas, setPerguntas] = useState([]);
  const [perguntasFiltradas, setPerguntasFiltradas] = useState([]);
  const [aberto, setAberto] = useState(null);

  const [filtro, setFiltro] = useState("");
  const [modal, setModal] = useState({
    show: false,
    categoria: "",
    titulo: "",
    resposta: "",
    tipo: "",
  });

  const [notificacao, setNotificacao] = useState({
    show: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: "",
  });
  const [confirmacao, setConfirmacao] = useState({
    show: false,
    titulo: "",
    texto: "",
    onSim: null,
  });
  const [loading, setLoading] = useState(false);

  async function buscarPerguntas() {
    setLoading(true);
    try {
      const perguntas = await getPerguntas();
      setLoading(false);
      const perguntasComExibindo = perguntas.map((p) => ({
        ...p,
        exibindo: false,
      }));

      setPerguntas(perguntasComExibindo);
      setPerguntasFiltradas(perguntasComExibindo);
    } catch (err) {
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  async function excluiPergunta(id) {
    setConfirmacao({
      show: false,
      titulo: "",
      texto: "",
      onSim: null,
    });
    setLoading(true);
    try {
      await deletePergunta(id);
      await buscarPerguntas();

      setLoading(false);

      setNotificacao({
        show: true,
        tipo: "sucesso",
        titulo: "Pergunta excluída com sucesso",
        mensagem: "A pergunta não irá mais aparecer no FAQ",
      });
      setTimeout(() => {
        setNotificacao({
          show: false,
          tipo: "sucesso",
          titulo: "",
          mensagem: "",
        });
      }, 700);
    } catch (err) {
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  function pesquisar() {
    if (filtro.trim() === "") {
      setPerguntasFiltradas(perguntas);
    } else {
      const filtradas = perguntas.filter((p) =>
        p.pergunta_titulo.toLowerCase().includes(filtro.toLowerCase())
      );
      setPerguntasFiltradas(filtradas);
    }
  }

  useEffect(() => {
    buscarPerguntas();
  }, []);

  return (
    <div
      className="h-[calc(100vh-3rem)] bg-gradient-to-br 
                    from-[#0e1033] via-[#14163d] to-[#1c1f4a] 
                    text-white p-6 flex flex-col"
    >
      {modal.show && (
        <ModalPergunta
          setModal={setModal}
          cat={modal.categoria}
          tit={modal.titulo}
          resp={modal.resposta}
          tipo={modal.tipo}
          setNotificacao={setNotificacao}
          setLoading={setLoading}
          navigate={navigate}
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

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
        <div className="flex w-full md:w-1/2 gap-2">
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                pesquisar();
              }
            }}
            placeholder="Pesquisar pergunta pelo título..."
            className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 
                       text-sm text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={pesquisar}
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg 
                       bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30
                       text-blue-300 transition"
          >
            <Search className="h-4 w-4" />
            Pesquisar
          </button>
        </div>

        <button
          onClick={() =>
            setModal({
              show: true,
              categoria: "",
              titulo: "",
              resposta: "",
              tipo: "cadastro",
            })
          }
          className="cursor-pointer flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 
                     text-blue-300 px-4 py-2 rounded-xl border border-blue-500/30 
                     transition w-fit"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Nova Pergunta</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {perguntasFiltradas.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhuma pergunta encontrada.</p>
        ) : (
          perguntasFiltradas.map((p) => {
            const isAberto = aberto === p.pergunta_id;
            return (
              <div
                key={p.pergunta_id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 
                           hover:bg-white/10 transition flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <div
                    className="flex items-center gap-3 cursor-pointer select-none"
                    onClick={() => setAberto(isAberto ? null : p.pergunta_id)}
                  >
                    <h2 className="text-base font-medium text-white">
                      {p.pergunta_titulo}
                    </h2>
                    {isAberto ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-white/10 text-gray-300">
                      {p.pergunta_categoria}
                    </span>
                    <button
                      onClick={() =>
                        setModal({
                          show: true,
                          categoria: p.pergunta_categoria,
                          titulo: p.pergunta_titulo,
                          resposta: p.pergunta_resposta,
                          tipo: "editar",
                        })
                      }
                      className="cursor-pointer p-1 rounded-lg hover:bg-yellow-500/20 text-yellow-400 transition"
                      title="Editar pergunta"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmacao({
                          show: true,
                          titulo:
                            "Tem certeza que deseja excluir essa pergunta?",
                          texto: "Essa ação não pode ser desfeita",
                          onSim: () => excluiPergunta(p.pergunta_id),
                        })
                      }
                      className="cursor-pointer p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                      title="Remover pergunta"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {isAberto && (
                  <div className="mt-2 border-t border-white/10 pt-2">
                    <p className="text-sm text-gray-300">
                      {p.pergunta_resposta}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
