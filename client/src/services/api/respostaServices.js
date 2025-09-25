import { api } from "../api.js";

export async function postResposta(idUsuario, idChamado, descricao, tipo) {
  try {
    const response = await api.post(`/resposta/${idChamado}/${idUsuario}`, {
      descricao,
      tipo,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em postResposta:", err);
    throw err;
  }
}
