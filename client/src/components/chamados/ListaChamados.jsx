import { visualizaResposta } from "../../services/api/respostaServices.js";
import { formatToDate } from "brazilian-values";
import { tratarErro } from "../default/funcoes.js";
import { Inbox, Bell } from "lucide-react";

export default function ListaChamados({
  setLoading,
  setNotificacao,
  navigate,
  buscarChamados,
  modo,
  chamados,
  setSelecionado,
  statusBadge,
  selecionado,
}) {
  async function visualiza(naoLidas) {
    setLoading(true);
    try {
      for (const m of naoLidas) {
        await visualizaResposta(m.resposta_id);
      }
      setLoading(false);

      await buscarChamados();
    } catch (err) {
      setLoading(false);
      console.error(err);
      tratarErro(setNotificacao, err, navigate);
    }
  }
  return (
    <aside className="w-1/4 border-r border-white/10 overflow-y-auto">
      {chamados.length > 0 &&
        chamados.map((chamado) => {
          const naoLidas = chamado.respostas.filter(
            (resposta) =>
              resposta.resposta_visualizada == 0 &&
              resposta.resposta_tipo == "suporte"
          );
          console.log(naoLidas.length);
          return (
            <div
              key={chamado.chamado_id}
              onClick={() => {
                if (modo == "meus") {
                  visualiza(naoLidas);
                }
                setSelecionado(chamado);
              }}
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

                <div className="ml-3 flex items-center gap-2">
                  {statusBadge(chamado.chamado_status)}

                  <div className="relative">
                    <Bell
                      className={`w-4 h-4 ${
                        naoLidas.length > 0 ? "text-white/80" : "text-white/30"
                      }`}
                    />
                    {naoLidas.length > 0 && (
                      <span
                        className="absolute -top-1 -right-1 grid place-items-center
                             min-w-4 h-4 px-1 rounded-full
                             bg-red-500 text-white text-[10px] font-semibold
                             shadow-md ring-1 ring-white/20"
                      >
                        {naoLidas.length > 9 ? "9+" : naoLidas.length}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/40 mt-1">
                {formatToDate(
                  new Date(chamado.chamado_data_abertura + "T03:00:00Z")
                )}
              </p>
            </div>
          );
        })}
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
