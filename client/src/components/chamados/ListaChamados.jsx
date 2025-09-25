import { formatToDate } from "brazilian-values";
import { Inbox } from "lucide-react";

export default function ListaChamados({
  modo,
  chamados,
  setSelecionado,
  statusBadge,
  selecionado,
}) {
  return (
    <aside className="w-1/3 border-r border-white/10 overflow-y-auto">
      {chamados.length > 0 &&
        chamados.map((chamado) => (
          <div
            key={chamado.chamado_id}
            onClick={() => setSelecionado(chamado)}
            className={`p-4 cursor-pointer border-b border-white/5 hover:bg-white/5 transition ${
              selecionado?.chamado_id === chamado.chamado_id
                ? "bg-white/10"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col flex-1">
                <h3 className="font-medium truncate text-sm">
                  {chamado.chamado_motivo}
                </h3>

                {modo === "liderados" && (
                  <span className="text-xs text-white/40 truncate">
                    {localStorage.getItem("usuario_role") === "supervisor"
                      ? chamado.usuario.usuario_nome
                      : `${chamado.usuario.usuario_nome} • ${chamado.usuario.setor.setor_nome}`}
                  </span>
                )}
              </div>

              <div className="ml-3">{statusBadge(chamado.chamado_status)}</div>
            </div>

            <p className="text-xs text-white/40 mt-1">
              {formatToDate(
                new Date(chamado.chamado_data_abertura + "T03:00:00Z")
              )}
            </p>
          </div>
        ))}
      {chamados.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-white/50">
          <Inbox className="w-12 h-12 mb-3 text-white/20" />
          <p className="text-sm font-medium">Nenhum chamado encontrado</p>
          <p className="text-xs text-white/30 mt-1">
            Assim que você tiver chamados abertos, eles aparecerão aqui
          </p>
        </div>
      )}
    </aside>
  );
}
