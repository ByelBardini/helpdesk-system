import TelaRelatorios from "../components/relatorios/TelaRelatorios.jsx";
import { useState } from "react";

export default function Relatorios() {
  const [selecionado, setSelecionado] = useState("abertos");

  const menu = {
    geral: [
      {
        key: "tempo",
        title: "Tempo de resolução",
        desc: "Tempo médio para cada chamado ser resolvido.",
      },
      {
        key: "responsaveis",
        title: "Responsáveis",
        desc: "Porcentagem de chamados resolvidos por cada responsável.",
      },
    ],
    periodo: [
      {
        key: "abertos",
        title: "Chamados abertos por período",
        desc: "Quantidade de chamados abertos em um intervalo de tempo.",
      },
      {
        key: "comparativo",
        title: "Chamados abertos x concluídos por período",
        desc: "Comparação de chamados abertos e resolvidos dentro de um período.",
      },
      {
        key: "erros",
        title: "Erros x Solicitações x Melhorias",
        desc: "Comparação de chamados abertos por tipo em um período.",
      },
      {
        key: "areas",
        title: "Áreas por período",
        desc: "Comparação de chamados abertos por área dentro de um período.",
      },
    ],
    individual: [
      {
        key: "area",
        title: "Comparativo por área",
        desc: "Comparação dos tipos de chamados em uma área específica, dentro de um período.",
      },
    ],
  };

  const getSelectedTitle = () => {
    const all = [...menu.geral, ...menu.periodo, ...menu.individual];
    return all.find((item) => item.key === selecionado)?.title || "";
  };

  const getSelectedDesc = () => {
    const all = [...menu.geral, ...menu.periodo, ...menu.individual];
    return all.find((item) => item.key === selecionado)?.desc || "";
  };

  return (
    <div className="h-full overflow-y-auto pb-12 bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">
              Geral
            </h3>
            <div className="space-y-2">
              {menu.geral.map((item) => (
                <div
                  key={item.key}
                  onClick={() => setSelecionado(item.key)}
                  className={`rounded-xl border p-3 transition cursor-pointer ${
                    selecionado === item.key
                      ? "bg-blue-600/20 border-blue-500"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <h2 className="text-sm font-semibold text-white">
                    {item.title}
                  </h2>
                  {selecionado === item.key && (
                    <p className="text-xs text-white/60 mt-1">{item.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">
              Período
            </h3>
            <div className="space-y-2">
              {menu.periodo.map((item) => (
                <div
                  key={item.key}
                  onClick={() => setSelecionado(item.key)}
                  className={`rounded-xl border p-3 transition cursor-pointer ${
                    selecionado === item.key
                      ? "bg-blue-600/20 border-blue-500"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <h2 className="text-sm font-semibold text-white">
                    {item.title}
                  </h2>
                  {selecionado === item.key && (
                    <p className="text-xs text-white/60 mt-1">{item.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-2">
              Individual
            </h3>
            <div className="space-y-2">
              {menu.individual.map((item) => (
                <div
                  key={item.key}
                  onClick={() => setSelecionado(item.key)}
                  className={`rounded-xl border p-3 transition cursor-pointer ${
                    selecionado === item.key
                      ? "bg-blue-600/20 border-blue-500"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <h2 className="text-sm font-semibold text-white">
                    {item.title}
                  </h2>
                  {selecionado === item.key && (
                    <p className="text-xs text-white/60 mt-1">{item.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <TelaRelatorios
          getSelectedTitle={getSelectedTitle}
          getSelectedDesc={getSelectedDesc}
        />
      </div>
    </div>
  );
}
