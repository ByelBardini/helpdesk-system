/* eslint-disable react-hooks/exhaustive-deps */
import { X, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { postCompras } from "../../services/api/compraServices.js";

export default function ModalSolicitaCompra({ setSolicita }) {
  const [item, setItem] = useState("");
  const [qtd, setQtd] = useState(0);
  const [motivo, setMotivo] = useState("");
  const [tipo, setTipo] = useState("");

  const [ok, setOk] = useState(false);

  async function solicitaCompra() {
    try {
      const id_usuario = localStorage.getItem("usuario_id");
      const id_empresa = localStorage.getItem("empresa_id");
      const id_setor = localStorage.getItem("setor_id");

      await postCompras(
        id_empresa,
        id_setor,
        id_usuario,
        item,
        qtd,
        motivo,
        tipo
      );

      alert("deu certo");
      setSolicita("");
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (tipo == "produto") {
      setOk(
        item.trim() != "" &&
          tipo.trim() != "" &&
          motivo.trim() != "" &&
          qtd > 0 &&
          !isNaN(parseFloat(qtd))
      );
    } else if (tipo == "servico") {
      setQtd(null);

      setOk(item.trim() != "" && tipo.trim() != "" && motivo.trim() != "");
    } else {
      setOk(false);
    }
  }, [item, qtd, tipo, motivo]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setSolicita(false);
    }
    window.addEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1f4a]/95 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold">
              Nova Solicitação de Compra
            </h3>
            <p className="text-xs text-white/60">Preencha os dados abaixo</p>
          </div>
          <button
            onClick={() => setSolicita(false)}
            className="cursor-pointer rounded-lg p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <label className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/70">Item</span>
              <span
                className={`text-xs ${
                  item.length >= 75 ? "text-red-400" : "text-white/40"
                }`}
              >
                {item.length}/75
              </span>
            </div>
            <input
              type="text"
              maxLength={75}
              onChange={(e) => setItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && ok) {
                  e.preventDefault();
                  solicitaCompra();
                }
              }}
              placeholder="Digite o item desejado"
              className="w-full h-10 rounded-lg border border-white/10 bg-white/10 
                         px-3 text-sm placeholder-white/40 outline-none focus:border-blue-400"
            />
          </label>

          {tipo != "servico" && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/70">Quantidade</span>
              <input
                type="text"
                onChange={(e) => setQtd(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && ok) {
                    e.preventDefault();
                    solicitaCompra();
                  }
                }}
                placeholder="Informe a quantidade"
                className={`w-full h-10 rounded-lg border bg-white/10 px-3 text-sm 
                        placeholder-white/40 outline-none focus:border-blue-400
                        ${
                          qtd < 1 || isNaN(parseFloat(qtd))
                            ? "border-red-400"
                            : "border-white/10"
                        }`}
              />
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/70">Tipo</span>
            <select
              onChange={(e) => setTipo(e.target.value)}
              className="w-full h-10 rounded-lg border border-white/10 bg-[#1b1f4a] 
             px-3 text-sm text-white placeholder-white/40 outline-none 
             focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
             appearance-none cursor-pointer"
            >
              <option hidden value={""}>
                Selecione o Tipo
              </option>
              <option
                value="produto"
                className="bg-[#1b1f4a] text-white hover:bg-[#2a2f6d]"
              >
                Produto
              </option>
              <option
                value="servico"
                className="bg-[#1b1f4a] text-white hover:bg-[#2a2f6d]"
              >
                Serviço
              </option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/70">Motivo</span>
              <span
                className={`text-xs ${
                  motivo.length >= 255 ? "text-red-400" : "text-white/40"
                }`}
              >
                {motivo.length}/255
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={255}
              onChange={(e) => setMotivo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && ok) {
                  e.preventDefault();
                  solicitaCompra();
                }
              }}
              placeholder="Descreva o motivo da solicitação"
              className="w-full rounded-lg border border-white/10 bg-white/10 
                         px-3 py-2 text-sm placeholder-white/40 outline-none focus:border-blue-400 resize-none"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={() => setSolicita(false)}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border 
                       border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white/70 
                       hover:bg-white/20 transition"
          >
            Cancelar
          </button>
          <button
            onClick={solicitaCompra}
            disabled={!ok}
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border 
             border-green-400/30 bg-green-500/20 px-5 py-2 text-sm font-medium text-green-200 
             hover:bg-green-500/30 transition 
             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500/20"
          >
            <Save className="h-4 w-4" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
