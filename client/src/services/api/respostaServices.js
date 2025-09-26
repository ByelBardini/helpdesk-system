import { api } from "../api.js";

export async function getResposta(id) {
  try {
    const response = await api.get(`/resposta/${id}`);

    return response.data;
  } catch (err) {
    console.error("Erro em getResposta:", err);
    throw err;
  }
}

export async function postResposta(idUsuario, idChamado, fd) {
  try {
    const response = await api.post(`/resposta/${idChamado}/${idUsuario}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
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
