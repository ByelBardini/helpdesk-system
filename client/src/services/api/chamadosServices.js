import { ApiError } from "../../../../server/middlewares/ApiError.js";
import { api } from "../api.js";

export async function getChamados(role, id) {
  try {
    const response = await api.get(`/chamado/usuario/${role}/${id}`);

    return response.data;
  } catch (err) {
    console.error("Erro em getChamados:", err);
    throw err;
  }
}

export async function getChamadosSuporte() {
  try {
    const response = await api.get(`/chamado/suporte/`);

    return response.data;
  } catch (err) {
    console.error("Erro em getChamados:", err);
    throw err;
  }
}

export async function postChamado(fd) {
  try {
    const response = await api.post("/chamado", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (err) {
    console.error("Erro em postChamado:", err);
    throw err;
  }
}

export async function alterarPrioridade(id, prioridade) {
  try {
    const response = await api.put(`/chamado/prioridade/${id}`, { prioridade });

    return response.data;
  } catch (err) {
    console.error("Erro em alterarPrioridade:", err);
    throw err;
  }
}

export async function alterarStatus(id, status) {
  try {
    const usuario_id = localStorage.getItem("usuario_id");
    const response = await api.put(`/chamado/status/${id}`, {
      status,
      usuario_id,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em alterarStatus:", err);
    throw err;
  }
}

export async function alterarResponsavel(id) {
  try {
    const responsavel = localStorage.getItem("usuario_id");
    const response = await api.put(`/chamado/responsavel/${id}`, {
      responsavel,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em alterarResponsavel:", err);
    throw err;
  }
}
