import { Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";

export default function FiltrosUsuarios({
  usuarios,
  setBuscaFiltro,
  setStatusFiltro,
  setEmpresaFiltro,
  setSetorFiltro,
}) {
  const [buscaTmp, setBuscaTmp] = useState("");
  const [statusTmp, setStatusTmp] = useState("todos");
  const [empresaTmp, setEmpresaTmp] = useState("todas");
  const [setorTmp, setSetorTmp] = useState("todos");

  const empresas = useMemo(() => {
    if (!usuarios) return [];
    const lista = Object.values(usuarios)
      .flat()
      .map((u) => u.empresa?.empresa_nome)
      .filter(Boolean);
    return [...new Set(lista)];
  }, [usuarios]);

  const setores = useMemo(() => {
    if (!usuarios) return [];
    const lista = Object.values(usuarios)
      .flat()
      .map((u) => u.setor?.setor_nome)
      .filter(Boolean);
    return [...new Set(lista)];
  }, [usuarios]);

  function aplicarFiltros() {
    setBuscaFiltro(buscaTmp);
    setStatusFiltro(statusTmp);
    setEmpresaFiltro(empresaTmp);
    setSetorFiltro(setorTmp);
  }

  return (
    <div className="flex gap-3 flex-1 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar usuário..."
          value={buscaTmp}
          onChange={(e) => setBuscaTmp(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && aplicarFiltros()}
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1c1f4a] border border-white/10 text-sm focus:outline-none focus:border-blue-400"
        />
      </div>

      <select
        value={statusTmp}
        onChange={(e) => setStatusTmp(e.target.value)}
        className="px-3 py-2 rounded-lg bg-[#1c1f4a] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400"
      >
        <option value="todos">Todos</option>
        <option value="ativos">Ativos</option>
        <option value="inativos">Inativos</option>
      </select>

      <select
        value={empresaTmp}
        onChange={(e) => setEmpresaTmp(e.target.value)}
        className="px-3 py-2 rounded-lg bg-[#1c1f4a] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400"
      >
        <option value="todas">Todas as empresas</option>
        {empresas.map((empresa) => (
          <option key={empresa} value={empresa} className="bg-[#0e1033]">
            {empresa}
          </option>
        ))}
      </select>

      <select
        value={setorTmp}
        onChange={(e) => setSetorTmp(e.target.value)}
        className="px-3 py-2 rounded-lg bg-[#1c1f4a] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400"
      >
        <option value="todos">Todos os setores</option>
        {setores.map((setor) => (
          <option key={setor} value={setor} className="bg-[#0e1033]">
            {setor}
          </option>
        ))}
      </select>

      <button
        onClick={aplicarFiltros}
        className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 hover:bg-blue-500/30 transition text-sm"
      >
        <Filter className="w-4 h-4" />
        <span>Aplicar</span>
      </button>
    </div>
  );
}
