import { PlusCircle, FileText, Trash2 } from "lucide-react";
import { useState, useRef } from "react";

export default function AnexosNovoChamado({ anexos = [], setAnexos }) {
  const [nome, setNome] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const inputFileRef = useRef(null);

  function formatBytes(bytes) {
    if (!bytes && bytes !== 0) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  const podeAdicionar = Boolean(nome.trim() && arquivo);

  function adiciona() {
    if (!podeAdicionar) return;
    const novo = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      fileName: arquivo.name,
      size: arquivo.size,
      file: arquivo,
    };
    setAnexos((prev) => [...(prev || []), novo]);

    setNome("");
    setArquivo(null);
    if (inputFileRef.current) inputFileRef.current.value = "";
  }

  function removeItem(id) {
    setAnexos((prev) => (prev || []).filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-col flex-1 gap-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/70">Anexos</label>
          </div>
          <input
            type="file"
            ref={inputFileRef}
            onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
            className="flex-1 bg-[#1c1f4a] rounded-lg px-3 py-2 text-sm text-white/70
                     outline-none focus:ring-2 focus:ring-[#6bb7ff]/40
                     file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0
                     file:bg-[#6a5acd]/40 file:text-white/80 file:cursor-pointer"
          />
        </div>

        <div className="flex flex-col flex-1 gap-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/70">
              Nome do anexo
            </label>
            <span
              className={`text-xs ${
                nome.length < 50 ? "text-white/50" : "text-red-400/50"
              }`}
            >
              {nome.length}/50
            </span>
          </div>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={50}
            placeholder="Digite o nome do anexo..."
            className="bg-[#1c1f4a] rounded-lg px-4 py-2 text-sm text-white/80
                 outline-none focus:ring-2 focus:ring-[#6bb7ff]/40"
          />
        </div>
        <button
          onClick={adiciona}
          disabled={!podeAdicionar}
          title={
            !podeAdicionar ? "Preencha nome e selecione o arquivo" : "Adicionar"
          }
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition
            ${
              podeAdicionar
                ? "cursor-pointer bg-[#6a5acd]/40 hover:bg-[#6a5acd]/60 text-white"
                : "cursor-not-allowed bg-white/5 text-white/30"
            }`}
        >
          <PlusCircle className="h-5 w-5" />
        </button>
      </div>

      {anexos.length > 0 && (
        <div className="mt-4 space-y-2">
          {anexos.map((anexo) => (
            <div
              key={anexo.id}
              className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10"
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="h-4 w-4 text-white/70" />
                <div className="min-w-0">
                  <div className="truncate text-sm text-white">
                    {anexo.nome}
                  </div>
                  <div className="text-xs text-white/50">
                    {anexo.fileName} • {formatBytes(anexo.size)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(anexo.id)}
                className="cursor-pointer inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-300 hover:bg-red-500/10 hover:text-red-200"
                title="Remover"
              >
                <Trash2 className="h-4 w-4" />
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
