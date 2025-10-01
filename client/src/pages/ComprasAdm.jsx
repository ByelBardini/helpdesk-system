import { useEffect, useState } from "react";
import { getCompras, putRecebimento } from "../services/api/compraServices.js";
import CardCompra from "../components/compras/CardCompra.jsx";
import ModalAprovaRecusa from "../components/compras/ModalAprovaRecusa.jsx";
import ModalMotivoRecusa from "../components/compras/ModalMotivoRecusa.jsx";

export default function ComprasAdm() {
  const [compras, setCompras] = useState([]);

  const [status, setStatus] = useState({ show: false, tipo: "", id: null });
  const [motivoRecusa, setMotivoRecusa] = useState({
    show: false,
    motivo: null,
  });

  async function marcaRecebido(id) {
    try {
      await putRecebimento(id);
      await buscaCompras();

      alert("Deu bom");
    } catch (err) {
      console.error(err);
    }
  }

  async function buscaCompras() {
    try {
      const todas = await getCompras(localStorage.getItem("usuario_id"));
      setCompras(todas);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    console.log(status);
  }, [status]);

  useEffect(() => {
    buscaCompras();
  }, []);

  const abertas = compras.filter((c) => c.compra_status === "em analise");
  const aprovadas = compras.filter((c) => c.compra_status === "aprovado");
  const recusadas = compras.filter((c) => c.compra_status === "recusado");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-6">
      {status.show && (
        <ModalAprovaRecusa
          acao={status.status}
          id={status.id}
          setStatus={setStatus}
          buscaCompras={buscaCompras}
        />
      )}
      {motivoRecusa.show && (
        <ModalMotivoRecusa
          setMotivoRecusa={setMotivoRecusa}
          motivoRecusa={motivoRecusa}
        />
      )}
      <div className="pb-23 grid grid-cols-1 md:grid-cols-3 gap-6 h-screen">
        <div className="flex flex-col bg-white/5 border border-white/10 rounded-xl p-4 overflow-auto">
          <h2 className="text-lg font-semibold text-yellow-300 mb-4">
            Em Análise
          </h2>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {abertas.length > 0 ? (
              abertas.map((c) => (
                <CardCompra
                  key={c.compra_id}
                  solicitacao={c}
                  setStatus={setStatus}
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">
                Nenhuma solicitação em análise
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col bg-white/5 border border-white/10 rounded-xl p-4 overflow-auto">
          <h2 className="text-lg font-semibold text-green-300 mb-4">
            Aprovadas
          </h2>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {aprovadas.length > 0 ? (
              aprovadas.map((c) => (
                <CardCompra
                  key={c.compra_id}
                  solicitacao={c}
                  setStatus={marcaRecebido}
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">
                Nenhuma solicitação aprovada
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col bg-white/5 border border-white/10 rounded-xl p-4 overflow-auto">
          <h2 className="text-lg font-semibold text-red-300 mb-4">Recusadas</h2>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {recusadas.length > 0 ? (
              recusadas.map((c) => (
                <CardCompra
                  key={c.compra_id}
                  solicitacao={c}
                  setMotivoRecusa={setMotivoRecusa}
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">
                Nenhuma solicitação recusada
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
