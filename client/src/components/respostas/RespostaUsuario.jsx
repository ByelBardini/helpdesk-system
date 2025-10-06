import { useState, useRef } from "react";
import { Paperclip, Trash2, FileText, Image as ImageIcon } from "lucide-react";

export default function RespostaUsuario({ anexos, setAnexos }) {
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
    <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
      {/* --- Cabeçalho e upload --- */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-end justify-between">
        <div className="flex-1">
          <label className="text-sm font-medium text-white/80 mb-1 block">
            Adicionar anexo
          </label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setAnexoArquivo(e.target.files?.[0] ?? null)}
            className="block w-full text-xs file:mr-3 file:py-2 file:px-3
            file:rounded-md file:border-0 file:bg-[#6a5acd]/40
            file:text-white/90 hover:file:bg-[#6a5acd]/60 file:cursor-pointer
            bg-transparent"
          />
        </div>

        <div className="flex flex-col gap-2 sm:w-1/2">
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] ${
                anexoNome.length < 50 ? "text-white/50" : "text-red-400"
              }`}
            >
              {anexoNome.length}/50
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={anexoNome}
              maxLength={50}
              onChange={(e) => setAnexoNome(e.target.value)}
              placeholder="Nome do arquivo"
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
        </div>
      </div>

      {/* --- Listagem dos anexos --- */}
      {anexos.length > 0 && (
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-white/50 mb-2">
            {anexos.length} {anexos.length === 1 ? "arquivo anexado" : "arquivos anexados"}
          </p>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {anexos.map((a) => {
              const isImage = a.file?.type?.startsWith("image/");
              const iconColor = isImage ? "text-blue-400" : "text-purple-400";

              return (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-lg bg-[#0e1033]/60
                  border border-white/10 p-3 transition hover:border-[#6a5acd]/40"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isImage ? (
                      <ImageIcon className={`w-5 h-5 ${iconColor}`} />
                    ) : (
                      <FileText className={`w-5 h-5 ${iconColor}`} />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-white/90 truncate font-medium">
                        {a.nome}
                      </p>
                      <p className="text-xs text-white/40 truncate">
                        {a.file?.name} • {(a.file?.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveAnexo(a.id)}
                    className="cursor-pointer p-2 rounded-md hover:bg-red-500/20 transition"
                    aria-label="Remover anexo"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
