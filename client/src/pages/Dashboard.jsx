/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
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
} from "recharts";
import { Ticket, Eye, Loader2, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
  const resumo = {
    solicitacoes: { abertos: 18, concluidos: 42 },
    erros: { abertos: 9, concluidos: 27 },
    melhorias: { abertos: 12, concluidos: 20 },
  };

  const empresas = [
    { name: "Alpha", value: 38 },
    { name: "Beta", value: 22 },
    { name: "Gamma", value: 17 },
    { name: "Delta", value: 13 },
    { name: "Epsilon", value: 10 },
  ];

  const areas = [
    { name: "TI", value: 44 },
    { name: "Financeiro", value: 21 },
    { name: "Comercial", value: 18 },
    { name: "Operações", value: 15 },
    { name: "RH", value: 12 },
  ];

  const C = {
    card: "#2a2d5a",
    accent: "#6a5acd",
    blue: "#6bb7ff",
    green: "#22c55e",
    yellow: "#eab308",
    red: "#ef4444",
  };

  const kpis = [
    {
      title: "Novos chamados (geral)",
      value: 120,
      icon: Ticket,
      color: "bg-[#6bb7ff]/20 text-[#6bb7ff]",
    },
    {
      title: "Chamados Visualizados (geral)",
      value: 85,
      icon: Eye,
      color: "bg-yellow-500/20 text-yellow-400",
    },
    {
      title: "Chamados em andamento (geral)",
      value: 30,
      icon: Loader2,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      title: "Chamados resolvidos (mês)",
      value: 89,
      icon: CheckCircle2,
      color: "bg-green-500/20 text-green-400",
    },
  ];

  const proporcaoTipos = useMemo(() => {
    const solicit =
      resumo.solicitacoes.abertos + resumo.solicitacoes.concluidos;
    const err = resumo.erros.abertos + resumo.erros.concluidos;
    const melh = resumo.melhorias.abertos + resumo.melhorias.concluidos;
    return [
      { name: "Solicitações", value: solicit, color: C.blue },
      { name: "Erros", value: err, color: C.red },
      { name: "Melhorias", value: melh, color: C.accent },
    ];
  }, [resumo]);

  // “Balanço” em números fixos, mas com barras proporcionais ao maior total
  const mini = useMemo(() => {
    const items = [
      {
        titulo: "Abertos / Concluídos (Solicitações)",
        aberto: resumo.solicitacoes.abertos,
        concluido: resumo.solicitacoes.concluidos,
        colorA: C.blue,
        colorB: C.accent,
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
    ];
    const maxTotal = Math.max(1, ...items.map((i) => i.aberto + i.concluido));
    return items.map((i) => ({ ...i, maxTotal }));
  }, [resumo]);

  return (
    // ❗ sem gradient e sem min-h-screen — AdminLayout já cuida do fundo
    <div className="px-6 lg:px-10 pb-6">
      {/* grid sem overflow/altura fixa: deixa a página rolar naturalmente */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">
        {/* Balanço */}
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

        {/* KPIs + Área */}
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

        {/* Proporções */}
        <section className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="Proporção Erro / Solicitação / Melhoria">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      background: "#1f2347",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={24}
                    wrapperStyle={{ color: "#cbd5e1" }}
                  />
                  <Pie
                    data={proporcaoTipos}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {proporcaoTipos.map((e, i) => (
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
                  <Tooltip
                    contentStyle={{
                      background: "#1f2347",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                    }}
                  />
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
