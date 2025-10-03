/* eslint-disable react-hooks/exhaustive-deps */
import Notificacao from "../components/default/Notificacao.jsx";
import Loading from "../components/default/Loading.jsx";
import TabelaPerguntas from "../components/faq/TabelaPerguntas.jsx";
import ListaCategorias from "../components/faq/ListaCategorias.jsx";
import {
  HelpCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Currency,
} from "lucide-react";
import { getPerguntas } from "../services/api/faqServices.js";
import { tratarErro, dividirEmPartes } from "../components/default/funcoes.js";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

export default function Faq() {
  const navigate = useNavigate();

  const [pesquisa, setPesquisa] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  const [perguntas, setPerguntas] = useState([]);
  const [perguntasFiltradas, setPerguntasFiltradas] = useState([]);
  const [perguntasOrdenadas, setPerguntasOrdenadas] = useState([]);

  const [sessao, setSessao] = useState(0);
  const [porPagina, setPorPagina] = useState(6);

  const containerRef = useRef(null);
  const searchRef = useRef(null);
  const tituloRef = useRef(null);

  const [notificacao, setNotificacao] = useState({
    show: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);

  function calcularPorPagina() {
    if (!containerRef.current) return;
    const alturaContainer = containerRef.current.clientHeight;
    const alturaBusca = searchRef.current?.getBoundingClientRect().height || 0;
    const alturaTitulo = tituloRef.current?.getBoundingClientRect().height || 0;

    const footer = document.querySelector("#faq-paginacao");
    const alturaFooter = footer?.getBoundingClientRect().height || 0;

    const alturaDisponivel =
      alturaContainer - alturaBusca - alturaTitulo - alturaFooter;

    const primeiroCard = containerRef.current.querySelector("article");
    const alturaCard = primeiroCard?.getBoundingClientRect().height || 60;


    const qtd = Math.max(1, Math.floor(alturaDisponivel / alturaCard));

    setPorPagina(qtd);
  }

  function filtra() {
    const filtrado = perguntas.filter(
      (pergunta) =>
        pergunta.pergunta_titulo
          .toLowerCase()
          .includes(pesquisa.toLowerCase()) &&
        pergunta.pergunta_categoria
          .toLowerCase()
          .includes(categoriaSelecionada.toLocaleLowerCase())
    );
    setPerguntasFiltradas(filtrado);
  }

  async function buscarPerguntas() {
    try {
      setLoading(true);
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

  useEffect(() => {
    buscarPerguntas();
    calcularPorPagina();
    window.addEventListener("resize", calcularPorPagina);
    return () => window.removeEventListener("resize", calcularPorPagina);
  }, []);

  useEffect(() => {
    filtra();
    setSessao(0);
  }, [pesquisa, categoriaSelecionada]);

  useEffect(() => {
    const ordenadas = dividirEmPartes(perguntasFiltradas, porPagina);
    setPerguntasOrdenadas(ordenadas);

    calcularPorPagina();
  }, [perguntasFiltradas, porPagina]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white lg:py-5 overflow-hidden">
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

      <div className="absolute inset-0 bg-gradient-to-tr from-[#1c1f4a]/40 via-transparent to-[#6bb7ff]/10 pointer-events-none" />

      <header className="relative max-w-7xl mx-auto mb-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-7 w-7 text-[#6bb7ff]" />
          <h1 className="text-2xl sm:text-3xl font-bold">FAQ</h1>
        </div>

        <button
          onClick={() => navigate("/home", { replace: true })}
          className="cursor-pointer flex items-center gap-2 rounded-xl bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 px-4 py-2 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Voltar</span>
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 z-10">
        <ListaCategorias
          setCategoriaSelecionada={setCategoriaSelecionada}
          categoriaSelecionada={categoriaSelecionada}
          perguntas={perguntas}
        />
        <TabelaPerguntas
          setPesquisa={setPesquisa}
          perguntasOrdenadas={perguntasOrdenadas[sessao] || []}
          perguntasFiltradas={perguntasFiltradas}
          toggleExibindo={(id) =>
            setPerguntasFiltradas((prev) =>
              prev.map((p) =>
                p.pergunta_id === id
                  ? { ...p, exibindo: !p.exibindo }
                  : { ...p, exibindo: false }
              )
            )
          }
          containerRef={containerRef}
          searchRef={searchRef}
          tituloRef={tituloRef}
        />
        {perguntasOrdenadas.length > 1 && (
          <div className="fixed bottom-0 left-0 w-full flex items-center justify-center pb-6 z-20">
            <div
              className="flex items-center gap-4 px-6 py-2 rounded-xl bg-[#2a2d5a]/90 shadow-lg backdrop-blur-sm"
              id="faq-paginacao"
            >
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
                  {perguntasOrdenadas.length}
                </span>
              </span>

              <button
                disabled={sessao === perguntasOrdenadas.length - 1}
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
  );
}
