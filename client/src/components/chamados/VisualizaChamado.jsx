import { formatToDate, formatToCapitalized } from "brazilian-values";
import { PlusCircle, Paperclip } from "lucide-react";

export default function VisualizaChamado({ selecionado, statusBadge }) {
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
                {selecionado.respostas.map((resposta) => (
                  <div
                    key={resposta.resposta_id}
                    className="rounded-lg bg-white/5 p-3 border border-white/10"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-white/80">
                        {resposta.usuario?.usuario_nome}
                      </span>
                      <span className="text-xs text-white/50">
                        {resposta.resposta_data_emissao}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {resposta.resposta_descricao}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/50">Nenhuma resposta ainda.</p>
            )}
          </div>

          <div className="mt-6">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 transition text-sm font-medium">
              <PlusCircle className="h-4 w-4" />
              Adicionar resposta
            </button>
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
