import { useState, useRef } from "react";
import { Paperclip, Trash2, FileText, Image as ImageIcon } from "lucide-react";

export default function RespostaUsuario({anexos, setAnexos}) {
  const [anexoNome, setAnexoNome] = useState("");
  const [anexoArquivo, setAnexoArquivo] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddAnexo = () => {
    if (!anexoArquivo) return;
    const id = crypto?.randomUUID?.() ?? Date.now().toString();
    setAnexos((prev) => [
      ...prev,
      { id, nome: anexoNome || anexoArquivo.name, file: anexoArquivo },
    ]);
    setAnexoNome("");
    setAnexoArquivo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveAnexo = (id) => {
    setAnexos((prev) => prev.filter((a) => a.id !== id));
  };
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-3">
      <div className="text-sm font-medium text-white/80">Anexos</div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => setAnexoArquivo(e.target.files?.[0] ?? null)}
          className="block w-full text-xs file:mr-3 file:py-2 file:px-3
                   file:rounded-md file:border-0 file:bg-[#6a5acd]/40
                   file:text-white/90 hover:file:bg-[#6a5acd]/60 file:cursor-pointer
                   bg-transparent"
        />
        <input
          type="text"
          value={anexoNome}
          onChange={(e) => setAnexoNome(e.target.value)}
          placeholder="Nome do arquivo "
          className="flex-1 rounded-md bg-[#0e1033]/50 border border-white/10 p-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#6a5acd] text-white placeholder-white/40"
        />
        <button
          onClick={handleAddAnexo}
          disabled={!anexoArquivo}
          className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg
                   bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 transition text-sm font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Paperclip className="h-4 w-4" />
          Adicionar
        </button>
      </div>

      {anexos.length > 0 && (
        <ul className="space-y-2">
          {anexos.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-md bg-[#0e1033]/40
                       border border-white/10 p-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                {a.file?.type?.startsWith("image/") ? (
                  <ImageIcon className="w-4 h-4 text-white/50" />
                ) : (
                  <FileText className="w-4 h-4 text-white/50" />
                )}
                <div className="min-w-0">
                  <p className="text-sm text-white/90 truncate">{a.nome}</p>
                  <p className="text-xs text-white/40 truncate">
                    {a.file?.name} •{" "}
                    {a.file ? (a.file.size / 1024).toFixed(1) : 0} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveAnexo(a.id)}
                className="cursor-pointer p-2 rounded-md hover:bg-white/10 transition"
                aria-label="Remover anexo"
              >
                <Trash2 className="w-4 h-4 text-white/60" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
