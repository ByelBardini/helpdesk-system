import ModalSolicitaCompra from "../components/compras/ModalSolicitaCompra.jsx";
import CardCompra from "../components/compras/CardCompra.jsx";
import { PlusCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCompras } from "../services/api/compraServices.js";

export default function Compras() {
  const [solicita, setSolicita] = useState(false);

  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState([]);

  async function buscaCompras() {
    try {
      const compras = await getCompras(localStorage.getItem("usuario_id"));
      console.log("compras:", compras);

      setSolicitacoes(compras);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    buscaCompras();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] text-white p-6">
      {solicita && <ModalSolicitaCompra setSolicita={setSolicita} />}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/home", { replace: true })}
            className="cursor-pointer flex items-center gap-2 bg-white/5 hover:bg-white/10 
                       border border-white/10 px-4 py-2 rounded-lg transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Voltar</span>
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blue-400" />
            Solicitações de Compras
          </h1>
        </div>

        <button
          onClick={() => setSolicita(true)}
          className="cursor-pointer inline-flex items-center gap-2 rounded-lg border 
                     border-blue-400/30 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-200 
                     hover:bg-blue-500/30 transition"
        >
          <PlusCircle className="h-5 w-5" />
          Nova Solicitação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solicitacoes.map((solicitacao) => (
          <CardCompra solicitacao={solicitacao} />
        ))}

        {solicitacoes.length === 0 && (
          <div className="col-span-full text-center text-gray-400 italic">
            Nenhuma solicitação encontrada
          </div>
        )}
      </div>
    </div>
  );
}
