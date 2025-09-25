import { formatToDate, formatToCapitalized } from "brazilian-values";
import { postResposta } from "../../services/api/respostaServices.js";
import { PlusCircle, Paperclip, X, Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function VisualizaChamado({
  setSelecionado,
  buscarChamados,
  selecionado,
  statusBadge,
}) {
  const [respondendo, setRespondendo] = useState(false);
  const [descricao, setDescricao] = useState("");

  async function enviarResposta() {
    if (descricao.trim() == "") {
      return;
    }
    try {
      const idUsuario = localStorage.getItem("usuario_id");
      await postResposta(
        idUsuario,
        selecionado.chamado_id,
        descricao,
        "usuario"
      );

      alert("Deu good");
      await buscarChamados();
      setRespondendo(false);
      setSelecionado(null);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setDescricao("");
  }, [respondendo]);

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
                  <li
                    key={anexo.anexo_id}
                    className="hover:text-[#6bb7ff] cursor-pointer"
                  >
                    {anexo.anexo_nome}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium mb-3">Respostas</h3>
            {selecionado.respostas.length > 0 ? (
              <div className="space-y-4">
                {selecionado.respostas.map((resposta) => {
                  const isSuporte = resposta.resposta_tipo === "suporte";

                  return (
                    <div
                      key={resposta.resposta_id}
                      className={`rounded-lg p-3 border ${
                        isSuporte
                          ? "bg-green-500/10 border-green-500/20"
                          : "bg-blue-500/10 border-blue-500/20"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className={`text-sm font-medium ${
                            isSuporte ? "text-green-400" : "text-blue-400"
                          }`}
                        >
                          {resposta.usuario?.usuario_nome}
                        </span>
                        <span className="text-xs text-white/50">
                          {formatToDate(
                            new Date(
                              resposta.resposta_data_emissao + "T03:00:00Z"
                            )
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {resposta.resposta_descricao}
                      </p>
                    </div>
                  );
                })}
              </div>
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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 transition text-sm font-medium"
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

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setRespondendo(false)}
                    className="cursor-pointer px-4 py-2 rounded-lg bg-red-500/40 hover:bg-red-500/60 transition text-sm font-medium flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </button>
                  <button
                    onClick={enviarResposta}
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
