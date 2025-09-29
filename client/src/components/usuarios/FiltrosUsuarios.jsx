import { Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";

export default function FiltrosUsuarios({
  usuarios,
  categoria,
  setUsuariosFiltrados,
}) {
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [setor, setSetor] = useState("");

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

  function aplicaFiltro() {
    const filtrados = usuarios[categoria].filter((usuario) => {
      const nomeMatch =
        busca === "" ||
        usuario.usuario_nome.toLowerCase().includes(busca.toLowerCase());

      const statusMatch =
        status === ""
          ? true
          : status === "1"
          ? usuario.usuario_ativo == 1
          : usuario.usuario_ativo == 0;

      const empresaMatch =
        empresa === "" ? true : usuario.empresa?.empresa_nome === empresa;

      const setorMatch =
        setor === "" ? true : usuario.setor?.setor_nome === setor;

      return nomeMatch && statusMatch && empresaMatch && setorMatch;
    });

    console.log(filtrados);

    setUsuariosFiltrados((prev) => ({
      ...prev,
      [categoria]: filtrados,
    }));
  }

  return (
    <div className="flex gap-3 flex-1 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar usuário..."
          value={busca}
          onKeyDown={(e) => e.key === "Enter" && aplicaFiltro()}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1c1f4a] border border-white/10 text-sm focus:outline-none focus:border-blue-400"
        />
      </div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 rounded-lg bg-[#1c1f4a] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400"
      >
        <option value="">Todos</option>
        <option value="1">Ativos</option>
        <option value="0">Inativos</option>
      </select>

      <select
        value={empresa}
        onChange={(e) => setEmpresa(e.target.value)}
        className="px-3 py-2 rounded-lg bg-[#1c1f4a] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400"
      >
        <option value="">Todas as empresas</option>
        {empresas.map((empresa) => (
          <option key={empresa} value={empresa} className="bg-[#0e1033]">
            {empresa}
          </option>
        ))}
      </select>

      <select
        value={setor}
        onChange={(e) => setSetor(e.target.value)}
        className="px-3 py-2 rounded-lg bg-[#1c1f4a] border border-white/10 text-sm text-white focus:outline-none focus:border-blue-400"
      >
        <option value="">Todos os setores</option>
        {setores.map((setor) => (
          <option key={setor} value={setor} className="bg-[#0e1033]">
            {setor}
          </option>
        ))}
      </select>

      <button
        onClick={aplicaFiltro}
        className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 hover:bg-blue-500/30 transition text-sm"
      >
        <Filter className="w-4 h-4" />
        <span>Aplicar</span>
      </button>
    </div>
  );
}
