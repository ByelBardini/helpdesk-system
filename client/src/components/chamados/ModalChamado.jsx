/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import DadosModalChamado from "./DadosModalChamado.jsx";
import RespostasSuporte from "../respostas/RespostasSuporte.jsx";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  alterarStatus,
  alterarPrioridade,
} from "../../services/api/chamadosServices.js";
import { tratarErro } from "../default/funcoes.js";

export default function ModalChamado({
  setAbreChamado,
  chamado,
  setLoading,
  setNotificacao,
  setConfirmacao,
  navigate,
  buscaChamados,
}) {
  const [prioridade, setPrioridade] = useState(
    chamado?.chamado_prioridade || "baixa"
  );
  const [respostas, setRespostas] = useState([]);

  async function alteraPrioridade(prioridade) {
    setLoading(true);
    try {
      await alterarPrioridade(chamado.chamado_id, prioridade);
      await buscaChamados();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  async function alteraStatus(status) {
    setConfirmacao({
      show: false,
      titulo: "",
      texto: "",
      onSim: null,
    });
    setLoading(true);
    try {
      await alterarStatus(chamado.chamado_id, status);
      await buscaChamados();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  useEffect(() => {
    setRespostas(chamado.respostas);
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setAbreChamado(false);
    }
    window.addEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (chamado.chamado_status == "em aberto") {
      alteraStatus("visualizado");
      alteraPrioridade("baixa");
    }
  }, []);

  if (!chamado) return null;

  const status = chamado.chamado_status;

  const podeEditar = status !== "resolvido";
  const podeResponder = status !== "resolvido";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a]
                   w-[95%] max-w-6xl h-[85%] rounded-2xl shadow-xl overflow-hidden flex text-white relative"
      >
        <button
          onClick={() => setAbreChamado(false)}
          className="cursor-pointer absolute top-4 right-4 text-gray-300 hover:text-white"
        >
          <X size={22} />
        </button>

        <DadosModalChamado
          chamado={chamado}
          podeEditar={podeEditar}
          setPrioridade={setPrioridade}
          prioridade={prioridade}
          alteraStatus={alteraStatus}
          setConfirmacao={setConfirmacao}
          alteraPrioridade={alteraPrioridade}
          setAbreChamado={setAbreChamado}
        />

        <RespostasSuporte
          chamado={chamado}
          respostas={respostas}
          setRespostas={setRespostas}
          podeResponder={podeResponder}
          setLoading={setLoading}
          setNotificacao={setNotificacao}
          setConfirmacao={setConfirmacao}
        />
      </motion.div>
    </div>
  );
}
