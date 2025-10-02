/* eslint-disable react-hooks/exhaustive-deps */
import CardCompra from "../components/compras/CardCompra.jsx";
import ModalAprovaRecusa from "../components/compras/ModalAprovaRecusa.jsx";
import ModalMotivoRecusa from "../components/compras/ModalMotivoRecusa.jsx";
import Loading from "../components/default/Loading.jsx";
import Notificacao from "../components/default/Notificacao.jsx";
import Confirmacao from "../components/default/Confirmacao.jsx";
import { useEffect, useState } from "react";
import { getCompras, putRecebimento } from "../services/api/compraServices.js";
import { useNavigate } from "react-router-dom";
import { tratarErro } from "../components/default/funcoes.js";

export default function ComprasAdm() {
  const navigate = useNavigate;
  const [compras, setCompras] = useState([]);

  const [status, setStatus] = useState({ show: false, tipo: "", id: null });
  const [motivoRecusa, setMotivoRecusa] = useState({
    show: false,
    motivo: null,
  });

  const [notificacao, setNotificacao] = useState({
    show: false,
    tipo: "sucesso",
    titulo: "",
    mensagem: "",
  });
  const [confirmacao, setConfirmacao] = useState({
    show: false,
    titulo: "",
    texto: "",
    onSim: null,
  });
  const [loading, setLoading] = useState(false);

  async function marcaRecebido(id) {
    setLoading(true);
    try {
      await putRecebimento(id);
      await buscaCompras();
      setLoading(false);

      setNotificacao({
        show: true,
        tipo: "sucesso",
        titulo: "Recebimento alterado",
        mensagem: "O status do recebimento foi alterado com sucesso",
      });
      setTimeout(() => {
        setNotificacao({
          show: false,
          tipo: "sucesso",
          titulo: "",
          mensagem: "",
        });
      }, 700);
    } catch (err) {
      setLoading(false);
      console.error(err);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  async function buscaCompras() {
    setLoading(true);
    try {
      const todas = await getCompras(localStorage.getItem("usuario_id"));
      setLoading(false);

      setCompras(todas);
    } catch (err) {
      setLoading(false);
      console.error(err);
      tratarErro(setNotificacao, err, navigate);
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
      {confirmacao.show && (
        <Confirmacao
          texto={confirmacao.texto}
          titulo={confirmacao.titulo}
          onSim={confirmacao.onSim}
          onNao={() =>
            setConfirmacao({
              show: false,
              titulo: "",
              texto: "",
              onSim: null,
            })
          }
        />
      )}
      {notificacao.show && (
        <Notificacao
          titulo={notificacao.titulo}
          mensagem={notificacao.mensagem}
          tipo={notificacao.tipo}
          onClick={() =>
            setNotificacao({
              show: false,
              tipo: "sucesso",
              titulo: "",
              mensagem: "",
            })
          }
        />
      )}
      {loading && <Loading />}
      {status.show && (
        <ModalAprovaRecusa
          acao={status.status}
          id={status.id}
          setStatus={setStatus}
          buscaCompras={buscaCompras}
          setLoading={setLoading}
          setNotificacao={setNotificacao}
          setConfirmacao={setConfirmacao}
          navigate={navigate}
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
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {abertas.length > 0 ? (
              abertas.map((c) => (
                <CardCompra
                  adm={true}
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
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {aprovadas.length > 0 ? (
              aprovadas.map((c) => (
                <CardCompra
                  adm={true}
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
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {recusadas.length > 0 ? (
              recusadas.map((c) => (
                <CardCompra
                  adm={true}
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
