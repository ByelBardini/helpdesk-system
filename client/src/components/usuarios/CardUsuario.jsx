import { Pencil } from "lucide-react";

export default function CardUsuario({ usuario }) {
  return (
    <div
      key={usuario.usuario_id}
      className="p-4 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center text-sm hover:bg-white/10 transition"
    >
      <div>
        <span className="font-medium block text-white">
          {usuario.usuario_nome}
        </span>
        <span className="text-xs text-gray-400 block">
          {usuario.usuario_login}
        </span>
        <span className="text-xs text-gray-300 block">
          {usuario.empresa?.empresa_nome} — {usuario.setor?.setor_nome}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            usuario.usuario_ativo
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {usuario.usuario_ativo ? "Ativo" : "Inativo"}
        </span>
        <button
          className="cursor-pointer p-2 rounded-md bg-blue-500/20 border border-blue-400/30 hover:bg-blue-500/30 transition"
          title="Editar usuário"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
