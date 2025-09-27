export default function TempoResolucao({ resultado }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm shadow-lg w-full max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-white/90">
          Tempo médio de resolução (dias)
        </h3>
        <h3 className="text-base font-semibold text-white/70">
          {resultado.nomeEmpresa || "Todas as empresas"}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
          <thead className="bg-white/10 text-white/80">
            <tr>
              <th className="px-6 py-3 text-left">Média geral</th>
              <th className="px-6 py-3 text-left border-l border-white/10">
                Prioridade Baixa
              </th>
              <th className="px-6 py-3 text-left border-l border-white/10">
                Prioridade Média
              </th>
              <th className="px-6 py-3 text-left border-l border-white/10">
                Prioridade Alta
              </th>
              <th className="px-6 py-3 text-left border-l border-white/10">
                Prioridade Urgente
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            <tr className="text-white/90 bg-white/[0.02] hover:bg-white/[0.05] transition">
              <td className="px-6 py-4 font-semibold">
                {resultado.tempoMedioGeral}
              </td>
              <td className="px-6 py-4 border-l border-white/10">
                {resultado.porPrioridade.find((p) => p.prioridade === "baixa")
                  ?.tempoMedioDias || "--"}
              </td>
              <td className="px-6 py-4 border-l border-white/10">
                {resultado.porPrioridade.find((p) => p.prioridade === "media")
                  ?.tempoMedioDias || "--"}
              </td>
              <td className="px-6 py-4 border-l border-white/10">
                {resultado.porPrioridade.find((p) => p.prioridade === "alta")
                  ?.tempoMedioDias || "--"}
              </td>
              <td className="px-6 py-4 border-l border-white/10">
                {resultado.porPrioridade.find((p) => p.prioridade === "urgente")
                  ?.tempoMedioDias || "--"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
