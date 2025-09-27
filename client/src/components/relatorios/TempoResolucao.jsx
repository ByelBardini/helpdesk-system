export default function TempoResolucao({ resultado }) {
  const cores = {
    baixa: "text-green-400",
    media: "text-yellow-400",
    alta: "text-orange-400",
    urgente: "text-red-400",
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-lg shadow-lg w-full max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white/90">
          Tempo médio de resolução <span className="text-sm text-white/50">(dias)</span>
        </h3>
        <h3 className="text-base font-semibold text-white/70">
          {resultado.nomeEmpresa || "Todas as empresas"}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-white/10 text-white/80 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">Média Geral</th>
              <th className="px-6 py-3 text-center border-l border-white/10">Baixa</th>
              <th className="px-6 py-3 text-center border-l border-white/10">Média</th>
              <th className="px-6 py-3 text-center border-l border-white/10">Alta</th>
              <th className="px-6 py-3 text-center border-l border-white/10">Urgente</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            <tr className="text-white/90 bg-white/[0.03] hover:bg-white/[0.06] transition">
              <td className="px-6 py-4 font-semibold">{resultado.tempoMedioGeral}</td>
              <td className={`px-6 py-4 text-center border-l border-white/10 ${cores.baixa}`}>
                {resultado.porPrioridade.find((p) => p.prioridade === "baixa")?.tempoMedioDias || "--"}
              </td>
              <td className={`px-6 py-4 text-center border-l border-white/10 ${cores.media}`}>
                {resultado.porPrioridade.find((p) => p.prioridade === "media")?.tempoMedioDias || "--"}
              </td>
              <td className={`px-6 py-4 text-center border-l border-white/10 ${cores.alta}`}>
                {resultado.porPrioridade.find((p) => p.prioridade === "alta")?.tempoMedioDias || "--"}
              </td>
              <td className={`px-6 py-4 text-center border-l border-white/10 ${cores.urgente}`}>
                {resultado.porPrioridade.find((p) => p.prioridade === "urgente")?.tempoMedioDias || "--"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
