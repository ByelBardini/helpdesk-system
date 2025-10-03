/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { postAviso } from "../../services/api/avisosServices.js";
import { tratarErro } from "../default/funcoes.js";
import { formatToNumber } from "brazilian-values";
import { X } from "lucide-react";

export default function ModalCriaAviso({
  setCriaAviso,
  buscaAvisos,
  setNotificacao,
  setConfirmacao,
  setLoading,
  navigate,
}) {
  const [importancia, setImportancia] = useState("media");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const [isOk, setIsOk] = useState(false);

  const prioridades = [
    { valor: "baixa", label: "Baixa", cor: "green" },
    { valor: "media", label: "Média", cor: "orange" },
    { valor: "alta", label: "Alta", cor: "red" },
  ];

  async function criaAviso() {
    setConfirmacao({
      show: false,
      titulo: "",
      texto: "",
      onSim: null,
    });
    if (!isOk) {
      setNotificacao({
        show: true,
        tipo: "erro",
        titulo: "Dados inválidos",
        mensagem: "Preencha todos os dados",
      });
      return;
    }
    setLoading(true);
    try {
      await postAviso(importancia, titulo, descricao);
      await buscaAvisos();
      setLoading(false);
      setNotificacao({
        show: true,
        tipo: "sucesso",
        titulo: "Aviso criado com sucesso",
        mensagem:
          "O aviso foi criado com sucesso e será exibido para os usuários",
      });
      setTimeout(() => {
        setNotificacao({
          show: false,
          tipo: "sucesso",
          titulo: "",
          mensagem: "",
        });
        setCriaAviso(false);
      }, 700);
    } catch (err) {
      setLoading(false);
      console.error(err);
      tratarErro(setNotificacao, err, navigate);
    }
  }

  useEffect(() => {
    setIsOk(titulo != "" && descricao != "" && importancia != "");
  }, [titulo, descricao, importancia]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setCriaAviso(false);
    }
    window.addEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div
        className="bg-gradient-to-br from-[#0e1033] via-[#14163d] to-[#1c1f4a] 
                      border border-white/10 rounded-2xl shadow-lg w-full max-w-lg p-6 text-white"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Novo Aviso</h2>
          <button
            onClick={() => setCriaAviso(false)}
            className="cursor-pointer text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 text-center">
          <label className="block text-sm text-gray-300 mb-3">
            Importância
          </label>
          <div className="flex justify-center gap-3">
            {prioridades.map((p) => {
              const isActive = importancia === p.valor;
              return (
                <button
                  key={p.valor}
                  onClick={() => setImportancia(p.valor)}
                  className={`cursor-pointer px-4 py-2 rounded-lg border text-sm font-medium transition
                    ${
                      isActive
                        ? `bg-${p.cor}-500 text-white border-${p.cor}-500`
                        : `bg-${p.cor}-500/20 text-${p.cor}-300 border-${p.cor}-400/40 hover:bg-${p.cor}-500/30`
                    }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm text-gray-300 mb-2">Título</label>
            <span
              className={`text-xs ${
                titulo.length < 150 ? "text-white/50" : "text-red-400"
              }`}
            >
              {titulo.length}/150
            </span>
          </div>
          <input
            type="text"
            maxLength={150}
            onChange={(e) => {
              setTitulo(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isOk) {
                e.preventDefault();
                criaAviso();
              }
            }}
            placeholder="Digite o título do aviso"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label className="block text-sm text-gray-300 mb-2">
              Descrição
            </label>
            <span
              className={`text-xs ${
                descricao.length < 1500 ? "text-white/50" : "text-red-400"
              }`}
            >
              {formatToNumber(descricao.length)}/1.500
            </span>
          </div>
          <textarea
            rows="4"
            maxLength={1500}
            onChange={(e) => {
              setDescricao(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isOk) {
                e.preventDefault();
                criaAviso();
              }
            }}
            placeholder="Digite a descrição do aviso"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none custom-scrollbar"
          ></textarea>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setCriaAviso(false)}
            className="cursor-pointer px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={() =>
              setConfirmacao({
                show: true,
                titulo: "Tem certeza que deseja criar esse aviso?",
                texto: "Ele será exibido para todos os usuários",
                onSim: () => criaAviso(),
              })
            }
            disabled={!isOk}
            className="cursor-pointer px-4 py-2 rounded-lg 
             bg-blue-500/20 border border-blue-500/40 text-blue-300 
             hover:bg-blue-500/30 transition text-sm
             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500/20"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
