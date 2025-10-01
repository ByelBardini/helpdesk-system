import { Package, CreditCard } from "lucide-react";
import { formatToDate } from "brazilian-values";

export default function CardCompra({ solicitacao }) {
  const isProduto = solicitacao.compra_tipo === "produto";
  const colorClass = isProduto ? "text-blue-400" : "text-purple-400";

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
        <span className={`font-semibold ${colorClass}`}>Motivo:</span>{" "}
        {solicitacao.compra_motivo}
      </p>

      <div className="flex justify-between items-center mt-auto">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
            solicitacao.compra_status === "aprovado"
              ? "bg-green-500/20 text-green-300 border border-green-400/30"
              : solicitacao.compra_status === "em analise"
              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
              : solicitacao.compra_status === "reprovado"
              ? "bg-red-500/20 text-red-300 border border-red-400/30"
              : "bg-gray-500/20 text-gray-300 border border-gray-400/30"
          }`}
        >
          {solicitacao.compra_status}
        </span>

        <button className="cursor-pointer text-xs px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 transition">
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}
