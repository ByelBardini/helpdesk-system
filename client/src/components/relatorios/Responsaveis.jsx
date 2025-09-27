export default function Responsaveis({ resultado }) {
  const cores = {
    baixa: "text-green-400",
    media: "text-yellow-400",
    alta: "text-orange-400",
    urgente: "text-red-400",
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-lg shadow-lg w-full max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white/90">
          Porcentagem de resolução
          <span className="text-sm text-white/50 ml-2">
            (quantidade de chamados)
          </span>
        </h3>
        <h3 className="text-base font-semibold text-white/70">
          {resultado.nomeEmpresa || "Todas as empresas"}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-white/10 text-white/80 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">Responsável</th>
              <th className="px-6 py-3 text-center border-l border-white/10">
                Total
              </th>
              <th className="px-6 py-3 text-center border-l border-white/10">
                % dos Chamados
              </th>
              <th className="px-6 py-3 text-center border-l border-white/10">
                Baixa
              </th>
              <th className="px-6 py-3 text-center border-l border-white/10">
                Média
              </th>
              <th className="px-6 py-3 text-center border-l border-white/10">
                Alta
              </th>
              <th className="px-6 py-3 text-center border-l border-white/10">
                Urgente
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {resultado.responsaveis?.map((resp) => (
              <tr
                key={resp.usuario_id}
                className="text-white/90 hover:bg-white/[0.06] transition"
              >
                <td className="px-6 py-4 font-medium">{resp.nome}</td>
                <td className="px-6 py-4 text-center border-l border-white/10">
                  {resp.total}
                </td>
                <td className="px-6 py-4 text-center border-l border-white/10">
                  {Math.round(resp.porcentagem)}%
                </td>
                <td
                  className={`px-6 py-4 text-center border-l border-white/10 ${cores.baixa}`}
                >
                  {resp.prioridades?.baixa || 0}
                </td>
                <td
                  className={`px-6 py-4 text-center border-l border-white/10 ${cores.media}`}
                >
                  {resp.prioridades?.media || 0}
                </td>
                <td
                  className={`px-6 py-4 text-center border-l border-white/10 ${cores.alta}`}
                >
                  {resp.prioridades?.alta || 0}
                </td>
                <td
                  className={`px-6 py-4 text-center border-l border-white/10 ${cores.urgente}`}
                >
                  {resp.prioridades?.urgente || 0}
                </td>
              </tr>
            ))}

            <tr className="bg-white/10 text-white font-semibold">
              <td className="px-6 py-4">TOTAL</td>
              <td className="px-6 py-4 text-center border-l border-white/10">
                {resultado.totalGeral}
              </td>
              <td className="px-6 py-4 text-center border-l border-white/10">
                100%
              </td>
              <td
                className={`px-6 py-4 text-center border-l border-white/10 ${cores.baixa}`}
              >
                {resultado.totaisGerais?.find(
                  (t) => t.chamado_prioridade === "baixa"
                )?.total || 0}
              </td>
              <td
                className={`px-6 py-4 text-center border-l border-white/10 ${cores.media}`}
              >
                {resultado.totaisGerais?.find(
                  (t) => t.chamado_prioridade === "media"
                )?.total || 0}
              </td>
              <td
                className={`px-6 py-4 text-center border-l border-white/10 ${cores.alta}`}
              >
                {resultado.totaisGerais?.find(
                  (t) => t.chamado_prioridade === "alta"
                )?.total || 0}
              </td>
              <td
                className={`px-6 py-4 text-center border-l border-white/10 ${cores.urgente}`}
              >
                {resultado.totaisGerais?.find(
                  (t) => t.chamado_prioridade === "urgente"
                )?.total || 0}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
