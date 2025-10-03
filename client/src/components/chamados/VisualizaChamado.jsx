/* eslint-disable react-hooks/exhaustive-deps */
import RespostaUsuario from "../respostas/RespostaUsuario.jsx";
import ListaRespostas from "../respostas/ListaRespostas.jsx";
import { formatToDate, formatToCapitalized } from "brazilian-values";
import {
  postResposta,
  getResposta,
} from "../../services/api/respostaServices.js";
import { PlusCircle, Paperclip, X, Send, Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react"; // <<<
import { tratarErro } from "../default/funcoes.js";
import { socket } from "../../services/socket.js";

export default function VisualizaChamado({
  setLoading,
  setNotificacao,
  navigate,
  setConfirmacao,
  setSelecionado,
  selecionado,
  statusBadge,
}) {
  const [respondendo, setRespondendo] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [anexos, setAnexos] = useState([]);
  const [respostas, setRespostas] = useState([]);

  const [monstrarAnexos, setMostrarAnexos] = useState(false);
  const scrollRef = useRef(null);

  async function enviarResposta() {
    setConfirmacao({
      show: false,
      titulo: "",
      texto: "",
      onSim: null,
    });
    if (descricao.trim() == "") {
      setNotificacao({
        show: true,
        tipo: "erro",
        titulo: "Dados incorretos",
        mensagem: "A resposta não pode estar em branco",
      });
      return;
    }
    setLoading(true);
    try {
      const idUsuario = localStorage.getItem("usuario_id");

      const fd = new FormData();
      fd.append("descricao", descricao);
      fd.append("tipo", "usuario");

      (anexos || []).forEach((a) => {
        fd.append("nome[]", a.nome ?? (a.file?.name || "arquivo"));
        if (a.file) fd.append("arquivos", a.file);
      });

      await postResposta(idUsuario, selecionado.chamado_id, fd);
      setLoading(false);

      setNotificacao({
        show: true,
        tipo: "sucesso",
        titulo: "Resposta enviada",
        mensagem: "Sua resposta foi enviada com sucesso ao setor de TI",
      });

      await buscarRespostas();
      setTimeout(() => {
        setRespondendo(false);
        setNotificacao({
          show: false,
          tipo: "sucesso",
          titulo: "",
          mensagem: "",
        });
      }, 700);
    } catch (err) {
      setLoading(false);
      console.error(err);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  async function buscarRespostas() {
    const novasRespostas = await getResposta(selecionado.chamado_id);
    setRespostas(novasRespostas);
  }

  useEffect(() => {
    socket.on("reply:new", buscarRespostas);
    return () => {
      socket.off("reply:new", buscarRespostas);
    };
  }, []);

  useEffect(() => {
    setDescricao("");
  }, [respondendo]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setSelecionado(null);
    }
    window.addEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (selecionado) {
      setRespostas(selecionado.respostas);
    }
  }, [selecionado]);

  // <<< Controle de scroll: topo se resolvido, fundo caso contrário
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || !selecionado) return;

    const toTop = selecionado.chamado_status === "resolvido";

    // roda duas vezes para garantir após layout/medidas e imagens/anexos
    const run = () => {
      el.scrollTo({
        top: toTop ? 0 : el.scrollHeight,
        behavior: "auto",
      });
    };
    requestAnimationFrame(run);
    const t = setTimeout(run, 0);
    return () => clearTimeout(t);
  }, [
    selecionado?.chamado_id, // quando troca o chamado
    selecionado?.chamado_status, // quando status muda
    respostas.length, // quando quantidade de respostas muda
  ]);

  const toggleMostrarAnexos = () => {
    setMostrarAnexos((prev) => !prev);
  };

  return (
    <section
      key={selecionado?.chamado_id || "none"} // <<< força reset por chamado
      ref={scrollRef} // <<< aqui está o ref do scroll
      className="flex-1 overflow-y-auto custom-scrollbar"
    >
      {selecionado ? (
        <div className="flex flex-col">
          <div className="justify-between items-center flex sticky top-0 z-10 pl-6 bg-[#17193f] pt-1 border-b border-white/10">
            <h2 className="text-xl font-bold mb-2">
              {selecionado.chamado_motivo}
            </h2>
            <div className="mb-2 pr-2">
              {statusBadge(selecionado.chamado_status)}
            </div>
          </div>

          <div className="px-6 pt-2 space-y-6">
            <p className="text-sm text-white/50 mb-4">
              {selecionado.chamado_tipo == "solicitacao"
                ? "Solicitação"
                : formatToCapitalized(selecionado.chamado_tipo)}{" "}
              •{" "}
              {formatToDate(
                new Date(selecionado.chamado_data_abertura + "T03:00:00Z")
              )}
            </p>

            {selecionado.chamado_status == "resolvido" && (
              <div className="relative bg-green-500/10 border-l-4 border-green-500 rounded-lg px-5 py-4 text-sm text-green-100 shadow-md mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 border border-green-400/40">
                    <Check size={18} />
                  </span>
                  <p className="text-green-400 font-bold uppercase tracking-wide text-xs">
                    Resolução
                  </p>
                </div>

                <span className="block text-green-100 font-medium leading-relaxed">
                  {selecionado.chamado_resolucao || "Sem resolução registrada"}
                </span>
              </div>
            )}

            <p className="text-white/80 leading-relaxed mb-6">
              {selecionado.chamado_descricao}
            </p>

            {selecionado.anexos.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2 flex items-center gap-2 text-white/80">
                  <Paperclip className="h-4 w-4" />
                  Anexos
                </h3>
                <ul className="list-disc list-inside text-sm text-white/70">
                  {selecionado.anexos.map((anexo) => (
                    <li key={anexo.anexo_id}>
                      {" "}
                      {/* <<< movi a key para o li */}
                      <a
                        href={`${
                          import.meta.env.VITE_API_BASE_URL
                        }/imagem?path=${anexo.anexo_caminho}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#6bb7ff] cursor-pointer"
                      >
                        {anexo.anexo_nome}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-medium mb-3">Respostas</h3>
              {respostas.length > 0 ? (
                <ListaRespostas respostas={respostas} />
              ) : (
                <p className="text-sm text-white/50">Nenhuma resposta ainda.</p>
              )}
            </div>

            {selecionado.chamado_usuario_id ==
              localStorage.getItem("usuario_id") &&
              (!respondendo ? (
                <div className="mt-6">
                  <button
                    onClick={() => setRespondendo(true)}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 transition text-sm font-medium"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Adicionar resposta
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="relative w-full">
                    <textarea
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Digite sua resposta..."
                      className="w-full h-28 resize-none rounded-md bg-[#0e1033]/50 border border-white/10 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6a5acd] text-white placeholder-white/40"
                    />
                    <button
                      onClick={toggleMostrarAnexos}
                      className="absolute bottom-2 right-2 pb-2 rounded cursor-pointer"
                    >
                      <Paperclip className="h-4 text-white/50" />
                    </button>
                  </div>
                  {monstrarAnexos && (
                    <RespostaUsuario anexos={anexos} setAnexos={setAnexos} />
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setRespondendo(false)}
                      className="cursor-pointer px-4 py-2 rounded-lg bg-red-500/40 hover:bg-red-500/60 transition text-sm font-medium flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </button>
                    <button
                      onClick={() =>
                        setConfirmacao({
                          show: true,
                          titulo:
                            "Gostaria de enviar essa resposta ao setor de TI?",
                          texto:
                            "Confirme os dados, respostas não podem ser alteradas",
                          onSim: () => {
                            enviarResposta();
                          },
                        })
                      }
                      className="cursor-pointer px-4 py-2 rounded-lg bg-green-500/40 hover:bg-green-500/60 transition text-sm font-medium flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Enviar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-white/50">
          Selecione um chamado à esquerda para visualizar os detalhes
        </div>
      )}
    </section>
  );
}
