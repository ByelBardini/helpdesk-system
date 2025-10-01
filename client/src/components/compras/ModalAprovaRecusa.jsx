/* eslint-disable react-hooks/exhaustive-deps */
import { X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { putStatus } from "../../services/api/compraServices.js";

export default function ModalAprovaRecusa({
  acao = "aprovado",
  setStatus,
  id,
  buscaCompras,
}) {
  const [valor, setValor] = useState(0);
  const [motivo, setMotivo] = useState("");

  const [isOk, setIsOk] = useState(false);
  const isAprovado = acao === "aprovado";

  async function enviaDados() {
    try {
      if (acao == "aprovado") {
        await putStatus(id, acao, valor / 100);
      } else {
        await putStatus(id, acao, motivo);
      }
      buscaCompras();
      alert("deu certo");
      setStatus({ show: false, status: "", id: null });
    } catch (err) {
      console.error(err);
    }
  }

  function formatarMoeda(num) {
    return (num / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function handleValorChange(e) {
    const key = e.nativeEvent.data;

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      setValor((prev) => Math.floor(prev / 10));
      return;
    }

    if (!/^[0-9]$/.test(key)) return;

    setValor((prev) => prev * 10 + parseInt(key));
  }

  useEffect(() => {
    if (isAprovado) {
      setIsOk(valor > 0 && !isNaN(parseFloat(valor)));
    } else {
      setIsOk(motivo.trim() != "");
    }
  }, [motivo, valor]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setStatus({ show: false, status: "", id: null });
    }
    window.addEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1f4a]/90 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-lg font-semibold">
            {isAprovado ? "Aprovar Solicitação" : "Recusar Solicitação"}
          </h3>
          <button
            onClick={() => setStatus({ show: false, status: "", id: null })}
            className="cursor-pointer rounded-lg p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {isAprovado ? (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/70">Preço Aprovado</span>
              <input
                type="text"
                value={formatarMoeda(valor)}
                onChange={handleValorChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isOk) {
                    e.preventDefault();
                  }
                }}
                placeholder="Digite o valor"
                className="w-full h-10 rounded-lg border border-white/10 bg-white/10 
                           px-3 text-sm placeholder-white/40 outline-none focus:border-blue-400"
              />
            </label>
          ) : (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/70">Motivo da Recusa</span>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                maxLength={255}
                placeholder="Explique o motivo"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isOk) {
                    e.preventDefault();
                  }
                }}
                className="w-full min-h-[80px] rounded-lg border border-white/10 bg-white/10 
                           px-3 py-2 text-sm placeholder-white/40 outline-none focus:border-blue-400 resize-none"
              />
              <span
                className={`text-xs ${
                  motivo.length >= 255 ? "text-red-400" : "text-white/40"
                }`}
              >
                {motivo.length}/255
              </span>
            </label>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={() => setStatus({ show: false, status: "", id: null })}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border 
                       border-gray-400/30 bg-gray-500/20 px-5 py-2 text-sm font-medium text-gray-200 
                       hover:bg-gray-500/30 transition"
          >
            Cancelar
          </button>
          <button
            disabled={!isOk}
            onClick={enviaDados}
            className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border 
                       px-5 py-2 text-sm font-medium transition 
                       ${
                         isAprovado
                           ? "border-green-400/30 bg-green-500/20 text-green-200 hover:bg-green-500/30 disabled:hover:bg-green-500/20"
                           : "border-red-400/30 bg-red-500/20 text-red-200 hover:bg-red-500/30 disabled:hover:bg-red-500/20"
                       } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Check className="h-4 w-4" />
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
