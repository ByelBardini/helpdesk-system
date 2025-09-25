import { useState } from "react";
import { Paperclip, FileText, Download, ChevronDown } from "lucide-react";
import { formatToDate } from "brazilian-values";

export default function ListaRespostas({ selecionado }) {
  const [abertos, setAbertos] = useState(() => new Set());

  const toggle = (id) => {
    setAbertos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {selecionado.respostas.map((resposta) => {
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
                      const nome = anexo.anexo_nome;
                      const href = `${
                        import.meta.env.VITE_API_BASE_URL
                      }/imagem?path=${anexo.anexo_caminho}`;

                      return (
                        <li
                          key={anexo.anexo_id}
                          className="group flex items-center justify-between rounded-md bg-[#0e1033]/40 border border-white/10 p-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isImg ? (
                              <img
                                src={`${
                                  import.meta.env.VITE_API_BASE_URL
                                }/imagem?path=${anexo.anexo_caminho}`}
                                className="w-10"
                              ></img>
                            ) : (
                              <FileText className="w-4 h-4 text-white/60" />
                            )}
                            <a
                              href={href}
                              className="truncate text-sm text-white/90 hover:underline"
                            >
                              {nome}
                            </a>
                          </div>

                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-white/10"
                            aria-label={`Baixar ${nome}`}
                          >
                            <Download className="w-4 h-4 text-white/70" />
                          </a>
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
