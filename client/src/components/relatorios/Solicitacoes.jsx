import { formatToBRL } from "brazilian-values";

export default function Solicitacoes({ resultado }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-lg shadow-lg w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white/90">
          Relatório de Solicitações
        </h3>
        <h3 className="text-base font-semibold text-white/70">
          {resultado.nomeEmpresa || "Todas as empresas"}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-white/10 text-white/80 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3 text-center">Total Geral</th>
              <th className="px-6 py-3 text-center border-l border-white/10">
                Serviços
              </th>
              <th className="px-6 py-3 text-center border-l border-white/10">
                Produtos
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10 text-white/90">
            <tr className="hover:bg-white/[0.06] transition text-center font-medium">
              <td className="px-6 py-4">
                {formatToBRL(resultado.totalGeral || 0)}
              </td>
              <td className="px-6 py-4 border-l border-white/10">
                {formatToBRL(resultado.totalServicos || 0)}
              </td>
              <td className="px-6 py-4 border-l border-white/10">
                {formatToBRL(resultado.totalProdutos || 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
