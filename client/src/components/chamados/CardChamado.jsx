import { formatToCapitalized, formatToDate } from "brazilian-values";
import { Bell, AlertTriangle, Notebook } from "lucide-react";
import { useEffect, useState } from "react";

export default function CardChamado({
  chamado,
  conclusao,
  abertura,
  setAbreChamado,
  setChamadoSelecionado,
  visualiza,
}) {
  const [notificacao, setNotificacao] = useState(0);

  function corPrioridade(prioridade) {
    switch (prioridade?.toLowerCase()) {
      case "baixa":
        return "border-l-4 border-green-500/60";
      case "media":
        return "border-l-4 border-yellow-500/60";
      case "alta":
        return "border-l-4 border-orange-500/60";
      case "urgente":
        return "border-l-4 border-red-500/60";
      default:
        return "border-l-4 border-gray-500/60";
    }
  }

  function corTipo(tipo) {
    switch (tipo?.toLowerCase()) {
      case "solicitacao":
        return "bg-blue-500/20 text-blue-300 border border-blue-400/30";
      case "erro":
        return "bg-red-500/20 text-red-300 border border-red-400/30";
      case "manutencao":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30";
      case "melhoria":
        return "bg-purple-500/20 text-purple-300 border border-purple-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-400/30";
    }
  }

  function tempoDecorrido(dataAbertura) {
    const inicio = new Date(dataAbertura);
    const agora = new Date();

    inicio.setHours(0, 0, 0, 0);
    agora.setHours(0, 0, 0, 0);

    return Math.floor((agora - inicio) / (1000 * 60 * 60 * 24));
  }

  function calcularDuracao(inicio, fim) {
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(0, 0, 0, 0);

    const diffDias = Math.floor((fim - inicio) / (1000 * 60 * 60 * 24));

    if (diffDias === 0) return "no mesmo dia";
    if (diffDias === 1) return "1 dia";
    return `${diffDias} dias`;
  }

  function getWarning() {
    const dias = tempoDecorrido(abertura);
    const status = chamado.chamado_status?.toLowerCase();

    if (["em aberto", "visualizado"].includes(status)) {
      if (dias >= 5) {
        return {
          cor: "bg-red-500/20 text-red-300 border border-red-400/30",
          icone: <AlertTriangle className="w-4 h-4 text-red-400" />,
          texto: "Atrasado",
        };
      }
      if (dias >= 3) {
        return {
          cor: "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30",
          icone: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
          texto: `Aberto há ${dias} dias`,
        };
      }
    }
    return null;
  }

  const warning = getWarning();

  useEffect(() => {
    console.log(chamado.respostas);
    setNotificacao(
      chamado.respostas.filter(
        (resposta) =>
          resposta.resposta_visualizada == 0 &&
          resposta.resposta_tipo == "usuario"
      )
    );
  }, [chamado]);

  return (
    <div
      key={chamado.chamado_id}
      className={`rounded-xl p-4 shadow cursor-default transition-colors duration-200 bg-white/10 ${corPrioridade(
        chamado.chamado_prioridade
      )} hover:brightness-120`}
      onDoubleClick={() => {
        setChamadoSelecionado(chamado);
        if (notificacao.length > 0) {
          visualiza(notificacao);
        }
        setAbreChamado(true);
      }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-white">{chamado.chamado_motivo}</h3>
        <div className="flex gap-2">
          {notificacao.length > 0 && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">
              <Bell className="w-3.5 h-3.5" /> {notificacao.length}
            </span>
          )}
          <span
            className={`ml-2 text-xs px-2 py-0.5 rounded-full ${corTipo(
              chamado.chamado_tipo
            )}`}
          >
            {chamado.chamado_tipo === "solicitacao"
              ? "Solicitação"
              : formatToCapitalized(chamado.chamado_tipo)}
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-200 mt-2 font-semibold">
        {chamado.usuario?.empresa?.empresa_nome}
      </p>

      <p className="text-xs text-gray-200 mt-2">
        {chamado.usuario?.usuario_nome} — {chamado.usuario?.setor?.setor_nome}
      </p>

      <div className="text-xs mt-3 text-gray-300 space-y-1">
        <p className="flex items-center gap-2">
          Aberto em {formatToDate(abertura)}
        </p>

        {conclusao && (
          <p className="flex items-center gap-2">
            Concluído em {formatToDate(conclusao)}
            {chamado.chamado_status === "resolvido" && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-500/20 text-green-300 border border-green-400/30">
                {calcularDuracao(abertura, conclusao)}
              </span>
            )}
          </p>
        )}
      </div>

      {warning && (
        <div
          className={`mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${warning.cor}`}
        >
          {warning.icone} {warning.texto}
        </div>
      )}
    </div>
  );
}
