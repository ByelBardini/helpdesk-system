import { Package, CreditCard, User, DollarSign } from "lucide-react";
import { formatToDate, formatToBRL } from "brazilian-values";
import { useEffect } from "react";

export default function CardCompra({
  solicitacao,
  setMotivoRecusa,
  setStatus = () => {},
}) {
  const isProduto = solicitacao.compra_tipo === "produto";
  const colorClass = isProduto ? "text-blue-400" : "text-purple-400";

  useEffect(() => {
    console.log(localStorage.getItem("usuario_role"));
  }, []);

  return (
    <div
      key={solicitacao.compra_id}
      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition flex flex-col"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {isProduto ? (
            <Package className={`w-5 h-5 ${colorClass}`} />
          ) : (
            <CreditCard className={`w-5 h-5 ${colorClass}`} />
          )}
          <h2 className={`font-semibold text-lg ${colorClass}`}>
            {solicitacao.compra_item}
          </h2>
        </div>
        <span className="text-xs text-gray-400">#{solicitacao.compra_id}</span>
      </div>

      {(localStorage.getItem("usuario_role") == "gerente" ||
        localStorage.getItem("usuario_role") == "adm") && (
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-2 flex items-center gap-2">
          <User className={`font-semibold ${colorClass}`} size={22} />
          <span className={`font-semibold ${colorClass} text-sm`}>
            Solicitante:
          </span>
          <span className="text-white/80 text-sm">
            {solicitacao.solicitante?.usuario_nome}
          </span>
          <span className="text-gray-400 text-xs">
            — {solicitacao.setor?.setor_nome}
          </span>
        </div>
      )}

      {isProduto && (
        <p className="text-sm text-gray-300 mb-1">
          <span className={`font-semibold ${colorClass}`}>Quantidade:</span>{" "}
          {solicitacao.compra_quantidade}
        </p>
      )}

      <p className="text-sm text-gray-300 mb-1">
        <span className={`font-semibold ${colorClass}`}>Data:</span>{" "}
        {formatToDate(new Date(solicitacao.compra_data + "T03:00:00Z"))}
      </p>

      <p className="text-sm text-gray-300 mb-1">
        <span className={`mb-2 font-semibold ${colorClass}`}>Motivo:</span>{" "}
        {solicitacao.compra_motivo}
      </p>

      {solicitacao.compra_status === "aprovado" &&
        solicitacao.compra_recebida && (
          <span
            className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize
      ${
        solicitacao.compra_recebida === "a caminho"
          ? "bg-yellow-400/10 text-yellow-300 border border-yellow-400/10"
          : solicitacao.compra_recebida === "recebido"
          ? "bg-green-400/10 text-green-300 border border-green-400/10"
          : "bg-gray-400/10 text-gray-300 border border-gray-400/10"
      }`}
          >
            {solicitacao.compra_recebida == "a caminho"
              ? solicitacao.compra_recebida
              : `${solicitacao.compra_recebida} - ${formatToDate(
                  new Date(solicitacao.compra_data_recebimento + "T03:00:00Z")
                )}`}
          </span>
        )}

      {localStorage.getItem("usuario_role") === "adm" &&
        solicitacao.compra_status === "aprovado" && (
          <div
            className="mb-2 bg-green-500/10 border border-green-400/20 text-green-200 
        rounded-lg px-4 py-2 text-sm font-medium flex flex-col gap-1 mt-2"
          >
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="text-green-300" size={15} />
              <span className="font-semibold text-green-300">Preço</span>
            </div>

            {solicitacao.compra_tipo === "produto" ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-300">Unitário:</span>
                  <span>{formatToBRL(solicitacao.compra_valor)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Quantidade:</span>
                  <span>{solicitacao.compra_quantidade || 1}</span>
                </div>
                <div className="flex justify-between font-semibold text-green-300">
                  <span>Total:</span>
                  <span>
                    {formatToBRL(
                      solicitacao.compra_valor *
                        (solicitacao.compra_quantidade || 1)
                    )}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between font-semibold text-green-300">
                <span>Total:</span>
                <span>{formatToBRL(solicitacao.compra_valor)}</span>
              </div>
            )}
          </div>
        )}

      <div className="flex justify-between items-center mt-auto">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
            solicitacao.compra_status === "aprovado"
              ? "bg-green-500/20 text-green-300 border border-green-400/30"
              : solicitacao.compra_status === "em analise"
              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
              : solicitacao.compra_status === "recusado"
              ? "bg-red-500/20 text-red-300 border border-red-400/30"
              : "bg-gray-500/20 text-gray-300 border border-gray-400/30"
          }`}
        >
          {solicitacao.compra_status}
        </span>

        {solicitacao.compra_status == "em analise" &&
          localStorage.getItem("usuario_role") == "adm" && (
            <div className="gap-2 flex">
              <button
                onClick={() =>
                  setStatus({
                    show: true,
                    status: "recusado",
                    id: solicitacao.compra_id,
                  })
                }
                className="cursor-pointer text-xs px-3 py-1.5 rounded-lg border border-red-400/30 text-red-300 bg-red-500/10 hover:bg-red-500/20 transition"
              >
                Recusar
              </button>
              <button
                onClick={() =>
                  setStatus({
                    show: true,
                    status: "aprovado",
                    id: solicitacao.compra_id,
                  })
                }
                className="cursor-pointer text-xs px-3 py-1.5 rounded-lg border border-green-400/30 text-green-300 bg-green-500/10 hover:bg-green-500/20 transition"
              >
                Aprovar
              </button>
            </div>
          )}

        {solicitacao.compra_recebida == "a caminho" &&
          localStorage.getItem("usuario_role") == "adm" && (
            <button
              onClick={() => setStatus(solicitacao.compra_id)}
              className="cursor-pointer text-xs px-3 py-1.5 rounded-lg border border-green-400/30 text-green-300 bg-green-500/10 hover:bg-green-500/20 transition"
            >
              Atestar Recebimento
            </button>
          )}

        {solicitacao.compra_status == "recusado" && (
          <button
            onClick={() =>
              setMotivoRecusa({
                show: true,
                motivo: solicitacao.compra_motivo_recusa,
              })
            }
            className="cursor-pointer text-xs px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 transition"
          >
            Motivo
          </button>
        )}
      </div>
    </div>
  );
}
