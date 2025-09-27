/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Sector,
} from "recharts";
import { Ticket, Eye, Loader2, CheckCircle2 } from "lucide-react";
import { getDashboard } from "../services/api/dashboardServices.js";

export default function Dashboard() {
  async function buscaDados() {
    const dados = await getDashboard();

    //Empresas
    const empresas = dados.empresas.map((e) => ({
      name: e["empresa.empresa_nome"],
      value: e.total,
    }));
    setEmpresas(empresas);

    // Tipos
    const ordem = ["erro", "melhoria", "solicitacao"];
    const labels = {
      erro: "Erros",
      melhoria: "Melhorias",
      solicitacao: "Solicitações",
    };
    const cores = {
      erro: C.red,
      melhoria: C.accent,
      solicitacao: C.blue,
    };

    const tipos = ordem.map((tipo) => {
      const registro = dados.tipos.find((t) => t.chamado_tipo === tipo);
      return {
        name: labels[tipo],
        value: registro ? registro.total : 0, // garante 0 se não vier no backend
        color: cores[tipo],
      };
    });
    setTipos(tipos);

    // Areas
    const areas = dados.areas.map((a) => ({
      name: a.area_nome,
      value: a.total,
    }));
    setAreas(areas);

    // Novos chamados, visualizados, em andamento e resolvidos
    const kpis = [
      {
        title: "Novos chamados (geral)",
        value: dados.novos?.[0]?.total || 0,
        icon: Ticket,
        color: "bg-[#6bb7ff]/20 text-[#6bb7ff]",
      },
      {
        title: "Chamados Visualizados (geral)",
        value: dados.visualizados?.[0]?.total || 0,
        icon: Eye,
        color: "bg-yellow-500/20 text-yellow-400",
      },
      {
        title: "Chamados em andamento (geral)",
        value: dados.resolvendo?.[0]?.total || 0,
        icon: Loader2,
        color: "bg-blue-500/20 text-blue-400",
      },
      {
        title: "Chamados resolvidos (mês)",
        value: dados.resolvidos?.[0]?.total || 0,
        icon: CheckCircle2,
        color: "bg-green-500/20 text-green-400",
      },
    ];
    setKpis(kpis);

    //Balanço dos ultimos 30 dias
    function resumoStatus(arr = []) {
      return {
        concluidos: arr
          .filter((s) => s.chamado_status === "resolvido")
          .reduce((acc, s) => acc + s.total, 0),

        abertos: arr
          .filter((s) => s.chamado_status !== "resolvido")
          .reduce((acc, s) => acc + s.total, 0),
      };
    }

    const resumo = {
      solicitacoes: resumoStatus(dados.solicitacoes),
      erros: resumoStatus(dados.erros),
      melhorias: resumoStatus(dados.melhorias),
    };
    setResumo(resumo);

    console.log(dados);
  }

  useEffect(() => {
    buscaDados();
  }, []);

  const [empresas, setEmpresas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [resumo, setResumo] = useState({
    solicitacoes: { abertos: 0, concluidos: 0 },
    erros: { abertos: 0, concluidos: 0 },
    melhorias: { abertos: 0, concluidos: 0 },
  });

  const C = {
    card: "#2a2d5a",
    accent: "#6a5acd",
    blue: "#6bb7ff",
    green: "#22c55e",
    yellow: "#eab308",
    red: "#ef4444",
  };

  const mini = useMemo(() => {
    return [
      {
        titulo: "Abertos / Concluídos (Solicitações)",
        aberto: resumo.solicitacoes.abertos,
        concluido: resumo.solicitacoes.concluidos,
        colorA: C.blue,
        colorB: C.green,
      },
      {
        titulo: "Abertos / Concluídos (Erros)",
        aberto: resumo.erros.abertos,
        concluido: resumo.erros.concluidos,
        colorA: C.red,
        colorB: C.green,
      },
      {
        titulo: "Abertos / Concluídos (Melhorias)",
        aberto: resumo.melhorias.abertos,
        concluido: resumo.melhorias.concluidos,
        colorA: C.accent,
        colorB: C.green,
      },
    ].map((i) => ({
      ...i,
      maxTotal: Math.max(1, i.aberto + i.concluido),
    }));
  }, [resumo]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2a2d5a] border border-white/20 rounded-lg px-3 py-2 text-xs shadow-lg">
          <p>
            <span className="text-[#6bb7ff] font-medium">
              {payload[0].name}
            </span>
            <span className="text-white ml-1 font-semibold">
              : {payload[0].value}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full overflow-y-auto pb-12">
      <div className="mt-4 px-6 lg:px-10 pb-6">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">
          <section className="col-span-12 lg:col-span-3 rounded-2xl bg-[#2a2d5a]/60 border border-white/10 p-4 backdrop-blur-sm shadow-lg">
            <h2 className="text-sm font-semibold mb-3 text-white/90">
              Balanço dos últimos 30 dias
            </h2>
            <div className="space-y-3">
              {mini.map((m) => (
                <div
                  key={m.titulo}
                  className="p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <p className="text-xs text-white/70 mb-2">{m.titulo}</p>

                  <div className="h-3 w-full rounded-full overflow-hidden bg-white/10 ring-1 ring-white/10">
                    <div
                      className="h-full"
                      style={{
                        width: `${(m.aberto / m.maxTotal) * 100}%`,
                        background: m.colorA,
                      }}
                    />
                  </div>
                  <div className="h-3 w-full rounded-full overflow-hidden bg-white/10 ring-1 ring-white/10 mt-2">
                    <div
                      className="h-full"
                      style={{
                        width: `${(m.concluido / m.maxTotal) * 100}%`,
                        background: m.colorB,
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-1 text-[11px] text-white/60">
                    <span>Abertos {m.aberto}</span>
                    <span>Concluídos {m.concluido}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="col-span-12 lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <KpiCard
                key={k.title}
                title={k.title}
                value={k.value}
                Icon={k.icon}
                color={k.color}
              />
            ))}

            <div className="col-span-2 md:col-span-4 rounded-2xl bg-[#2a2d5a]/60 border border-white/10 p-4">
              <h3 className="text-sm font-semibold mb-3 text-white/90">
                Proporção por área
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={areas}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                    <XAxis
                      dataKey="name"
                      stroke="#cbd5e1"
                      tick={{ fill: "#cbd5e1", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#cbd5e1"
                      tick={{ fill: "#cbd5e1", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1f2347",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff",
                      }}
                      cursor={{ fill: "rgba(255,255,255,0.06)" }}
                    />
                    <Bar
                      dataKey="value"
                      name="Chamados"
                      radius={[6, 6, 0, 0]}
                      fill={C.accent}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChartCard title="Proporção Erro / Solicitação / Melhoria">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={24}
                      wrapperStyle={{ color: "#cbd5e1" }}
                    />
                    <Pie
                      data={tipos}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      label={{ fill: "#fff", fontSize: 12 }}
                      activeShape={(props) => (
                        <g>
                          <Sector
                            {...props}
                            outerRadius={props.outerRadius + 8}
                            fill={props.fill}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        </g>
                      )}
                    >
                      {tipos.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Proporção por empresa">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={24}
                      wrapperStyle={{ color: "#cbd5e1" }}
                    />
                    <Pie
                      data={empresas}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      label={{ fill: "#fff", fontSize: 12 }}
                      activeShape={(props) => (
                        <g>
                          <Sector
                            {...props}
                            outerRadius={props.outerRadius + 8}
                            fill={props.fill}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        </g>
                      )}
                    >
                      {empresas.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            [C.accent, C.blue, C.green, C.yellow, C.red][i % 5]
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, Icon, color }) {
  return (
    <div className="rounded-2xl bg-[#2a2d5a]/60 border border-white/10 p-4 flex items-center gap-3 backdrop-blur-sm shadow-lg">
      <div className={`w-10 h-10 grid place-items-center rounded-xl ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-white/60">{title}</p>
        <p className="text-2xl font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl bg-[#2a2d5a]/60 border border-white/10 p-4 backdrop-blur-sm shadow-lg">
      <h3 className="text-sm font-semibold mb-3 text-white/90">{title}</h3>
      {children}
    </div>
  );
}
