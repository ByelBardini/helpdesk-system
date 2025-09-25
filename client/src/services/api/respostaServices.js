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

export async function visualizaResposta(id) {
  try {
    const response = await api.put(`/resposta/visualiza/${id}`);

    return response.data;
  } catch (err) {
    console.error("Erro em visualizaResposta:", err);
    throw err;
  }
}
