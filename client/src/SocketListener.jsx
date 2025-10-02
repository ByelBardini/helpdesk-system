import { useEffect } from "react";
import { socket } from "./services/socket";
import { formatToCapitalized } from "brazilian-values";

export function SocketListener({ children }) {
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Permissão de notificação definida como:", permission);
      });
    } else {
      console.log("Permissão atual de notificação:", Notification.permission);
    }

    const novaResposta = (payload) => {
      if (Notification.permission === "granted") {
        new Notification("Nova resposta", {
          body: `${payload.titulo} - ${payload.snippet}`,
          tag: `reply-${Date.now()}`,
        });
      }
    };

    const novoChamado = (payload) => {
      if (Notification.permission === "granted") {
        new Notification("Novo chamado criado", {
          body: `${payload.motivo} - Usuário: ${payload.criadoPor}`,
          tag: `reply-${Date.now()}`,
        });
      } else {
        console.log("Notificação bloqueada");
      }
    };

    const updateChamado = (payload) => {
      if (Notification.permission === "granted") {
        new Notification(`Chamado atualizado: ${payload.titulo}`, {
          body: `Novo Status: ${formatToCapitalized(payload.status)}`,
          tag: `reply-${Date.now()}`,
        });
      } else {
        console.log("Notificação bloqueada");
      }
    };

    const encerraChamado = (payload) => {
      if (Notification.permission === "granted") {
        new Notification(`Chamado finalizado: ${payload.titulo}`, {
          body: `Resolução: ${payload.resolucao}`,
          tag: `reply-${Date.now()}`,
        });
      } else {
        console.log("Notificação bloqueada");
      }
    };

    socket.on("reply:new", novaResposta);
    socket.on("chamado:new", novoChamado);
    socket.on("chamado:update", updateChamado);
    socket.on("chamado:end", encerraChamado);

    return () => {
      socket.off("reply:new", novaResposta);
      socket.off("chamado:new", novoChamado);
      socket.off("chamado:update", updateChamado);
      socket.off("chamado:end", encerraChamado);
    };
  }, []);

  return children;
}
