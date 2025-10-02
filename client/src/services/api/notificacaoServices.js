import { api } from "../api.js";

export async function getNotificacoesChamadoSuporte() {
  try {
    const response = await api.get("/notificacao/suporte");

    return response.data;
  } catch (err) {
    console.error("Erro em getNotificacoesChamadoSuporte:", err);
    throw err;
  }
}

export async function getNotificacoesCompraAdm() {
  try {
    const response = await api.get("/notificacao/compra/adm");

    return response.data;
  } catch (err) {
    console.error("Erro em getNotificacoesCompraAdm:", err);
    throw err;
  }
}
