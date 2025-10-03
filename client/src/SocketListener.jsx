import { useEffect } from "react";
import { socket } from "./services/socket";
import { formatToCapitalized } from "brazilian-values";
import {
  sendNotification,
  requestPermission,
  isPermissionGranted,
} from "@tauri-apps/plugin-notification";

export function SocketListener({ children }) {
  useEffect(() => {
    async function notify(title, body) {
      let granted = await isPermissionGranted();
      if (!granted) {
        const permission = await requestPermission();
        granted = permission === "granted";
      }
      if (granted) {
        sendNotification({ title, body });
      } else {
        console.log("Notificação bloqueada:", title, body);
      }
    }

    const novaResposta = (payload) => {
      console.log("Evento reply:new");
      notify("Nova resposta", `${payload.titulo} - ${payload.snippet}`);
    };

    const novoChamado = (payload) => {
      console.log("Evento chamado:new");
      notify(
        "Novo chamado criado",
        `${payload.motivo} - Usuário: ${payload.criadoPor}`
      );
    };

    const updateChamado = (payload) => {
      console.log("Evento chamado:update");
      notify(
        `Chamado atualizado: ${payload.titulo}`,
        `Novo Status: ${formatToCapitalized(payload.status)}`
      );
    };

    const encerraChamado = (payload) => {
      console.log("Evento chamado:end");
      notify(
        `Chamado finalizado: ${payload.titulo}`,
        `Resolução: ${payload.resolucao}`
      );
    };

    const novaCompra = (payload) => {
      console.log("Evento compra:new");
      notify(
        `Nova Solicitação de Compra: ${payload.produto}`,
        `Solicitante: ${payload.solicitante} - Tipo: ${
          payload.tipo === "servico"
            ? "Serviço"
            : formatToCapitalized(payload.tipo)
        }`
      );
    };

    const compraNegada = (payload) => {
      console.log("Evento compra:denied");
      notify(
        `Solicitação de Compra Negada: ${payload.produto}`,
        `Motivo: ${payload.motivo}`
      );
    };

    const compraAprovada = (payload) => {
      console.log("Evento compra:aproved");
      notify(
        `Solicitação de Compra Aprovada: ${payload.produto}`,
        `Status: ${formatToCapitalized(payload.status)}`
      );
    };

    const compraRecebida = (payload) => {
      console.log("Evento compra:recieved");
      notify(
        `Item recebido: ${payload.produto}`,
        `Sua solicitação foi encerrada`
      );
    };

    socket.on("reply:new", novaResposta);

    socket.on("chamado:new", novoChamado);
    socket.on("chamado:update", updateChamado);
    socket.on("chamado:end", encerraChamado);

    socket.on("compra:new", novaCompra);
    socket.on("compra:denied", compraNegada);
    socket.on("compra:aproved", compraAprovada);
    socket.on("compra:recieved", compraRecebida);

    return () => {
      socket.off("reply:new", novaResposta);

      socket.off("chamado:new", novoChamado);
      socket.off("chamado:update", updateChamado);
      socket.off("chamado:end", encerraChamado);

      socket.off("compra:new", novaCompra);
      socket.off("compra:denied", compraNegada);
      socket.off("compra:aproved", compraAprovada);
      socket.off("compra:recieved", compraRecebida);
    };
  }, []);

  return children;
}
