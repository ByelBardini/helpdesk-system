import { useState } from "react";
import {
  Paperclip,
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Image,
} from "lucide-react";
import { formatToDate } from "brazilian-values";

export default function ListaRespostas({ respostas }) {
  const [abertos, setAbertos] = useState(() => new Set());
  const [baixando, setBaixando] = useState(null);
  const [concluido, setConcluido] = useState(null);

  const toggle = (id) => {
    setAbertos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  async function baixarArquivo(anexo) {
    try {
      setBaixando(anexo.anexo_id);
      setConcluido(null);

      const token = localStorage.getItem("token");
      const resp = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/download?path=${encodeURIComponent(
          anexo.anexo_caminho
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!resp.ok) throw new Error("Erro ao baixar o arquivo");

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = anexo.anexo_nome;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      await new Promise((r) => setTimeout(r, 700));

      setBaixando(null);
      setConcluido(anexo.anexo_id);

      setTimeout(() => setConcluido(null), 1000);
    } catch (err) {
      console.error(err);
      alert("Erro ao baixar o arquivo.");
    } finally {
      setTimeout(() => setBaixando(null), 700);
    }
  }

  return (
    <div className="space-y-4">
      {respostas.map((resposta) => {
        const isSuporte = resposta.resposta_tipo === "suporte";
        const temAnexos = (resposta.anexos?.length ?? 0) > 0;
        const aberto = abertos.has(resposta.resposta_id);

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
                {isSuporte ? "Suporte" : resposta.usuario?.usuario_nome}
              </span>
              <span className="text-xs text-white/50">
                {formatToDate(new Date(resposta.resposta_data_emissao))}
              </span>
            </div>

            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
              {resposta.resposta_descricao}
            </p>

            {temAnexos && (
              <div className="mt-3">
                <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                  <Paperclip className="w-4 h-4" />
                  <span>
                    {resposta.anexos.length}{" "}
                    {resposta.anexos.length === 1 ? "anexo" : "anexos"}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggle(resposta.resposta_id)}
                    className="ml-1 inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 text-white/70"
                    aria-expanded={aberto}
                    aria-controls={`anexos-${resposta.resposta_id}`}
                    title={aberto ? "Ocultar anexos" : "Exibir anexos"}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        aberto ? "rotate-180" : ""
                      }`}
                    />
                    {aberto ? "Ocultar" : "Exibir"}
                  </button>
                </div>

                {aberto && (
                  <ul
                    id={`anexos-${resposta.resposta_id}`}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  >
                    {resposta.anexos.map((anexo) => {
                      const isImg =
                        anexo.anexo_mime?.startsWith("image/") ||
                        /\.(png|jpe?g|gif|webp|svg)$/i.test(
                          anexo.anexo_caminho || ""
                        );

                      const sempreVisivel =
                        baixando === anexo.anexo_id ||
                        concluido === anexo.anexo_id;

                      return (
                        <li
                          key={anexo.anexo_id}
                          className="group flex items-center justify-between rounded-md bg-[#0e1033]/40 border border-white/10 p-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isImg ? (
                              <Image className="w-4 h-4 text-white/60" />
                            ) : (
                              <FileText className="w-4 h-4 text-white/60" />
                            )}
                            <span className="truncate text-sm text-white/90">
                              {anexo.anexo_nome}
                            </span>
                          </div>

                          <button
                            onClick={() => baixarArquivo(anexo)}
                            disabled={baixando === anexo.anexo_id}
                            className={`transition-all duration-300 p-1.5 rounded shadow-sm
                              ${
                                sempreVisivel
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100"
                              }
                              ${
                                baixando === anexo.anexo_id
                                  ? "bg-[#444a88] cursor-wait"
                                  : concluido === anexo.anexo_id
                                  ? "bg-green-600"
                                  : "bg-[#6a5acd]/70 hover:bg-[#7a6cff]"
                              }`}
                            title={
                              baixando === anexo.anexo_id
                                ? "Baixando..."
                                : concluido === anexo.anexo_id
                                ? "Concluído"
                                : "Baixar"
                            }
                          >
                            {baixando === anexo.anexo_id ? (
                              <Loader2 className="w-4 h-4 text-white animate-spin" />
                            ) : concluido === anexo.anexo_id ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : (
                              <Download className="w-4 h-4 text-white" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
