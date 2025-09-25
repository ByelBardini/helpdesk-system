/* eslint-disable react-hooks/exhaustive-deps */
import RespostaUsuario from "../respostas/RespostaUsuario.jsx";
import ListaRespostas from "../respostas/ListaRespostas.jsx";
import { formatToDate, formatToCapitalized } from "brazilian-values";
import { postResposta } from "../../services/api/respostaServices.js";
import { PlusCircle, Paperclip, X, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { tratarErro } from "../default/funcoes.js";

export default function VisualizaChamado({
  setLoading,
  setNotificacao,
  navigate,
  setConfirmacao,
  setSelecionado,
  buscarChamados,
  selecionado,
  statusBadge,
}) {
  const [respondendo, setRespondendo] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [anexos, setAnexos] = useState([]);

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
      await buscarChamados();
      setTimeout(() => {
        setRespondendo(false);
        setSelecionado(null);
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

  useEffect(() => {
    setDescricao("");
  }, [respondendo]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setSelecionado(null);
    }
    window.addEventListener("keydown", onKeyDown);
  }, []);

  return (
    <section className="flex-1 p-6 overflow-y-auto">
      {selecionado ? (
        <div>
          <h2 className="text-xl font-bold mb-2">
            {selecionado.chamado_motivo}
          </h2>
          <p className="text-sm text-white/50 mb-4">
            {selecionado.chamado_tipo == "solicitacao"
              ? "Solicitação"
              : formatToCapitalized(selecionado.chamado_tipo)}{" "}
            •{" "}
            {formatToDate(
              new Date(selecionado.chamado_data_abertura + "T03:00:00Z")
            )}
          </p>
          <div className="mb-4">{statusBadge(selecionado.chamado_status)}</div>

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
                  <li>
                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL}/imagem?path=${
                        anexo.anexo_caminho
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={anexo.anexo_id}
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
            {selecionado.respostas.length > 0 ? (
              <ListaRespostas selecionado={selecionado} />
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
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Digite sua resposta..."
                  className="w-full h-28 resize-none rounded-md bg-[#0e1033]/50 border border-white/10 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6a5acd] text-white placeholder-white/40"
                />

                <RespostaUsuario anexos={anexos} setAnexos={setAnexos} />

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
      ) : (
        <div className="h-full flex items-center justify-center text-white/50">
          Selecione um chamado à esquerda para visualizar os detalhes
        </div>
      )}
    </section>
  );
}
