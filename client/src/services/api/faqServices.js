import { api } from "../api.js";

export async function getPerguntas() {
  try {
    const response = await api.get("/faq");

    return response.data;
  } catch (err) {
    console.error("Erro em getPerguntas:", err);
    throw err;
  }
}

export async function deletePergunta(id) {
  try {
    const response = await api.delete(`/faq/${id}`);

    return response.data;
  } catch (err) {
    console.error("Erro em deletePergunta:", err);
    throw err;
  }
}

export async function putPergunta(id, categoria, titulo, resposta) {
  try {
    const response = await api.put(`/faq/${id}`, {
      categoria,
      titulo,
      resposta,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em putPergunta:", err);
    throw err;
  }
}

export async function postPergunta(categoria, titulo, resposta) {
  try {
    const response = await api.post(`/faq/`, {
      categoria,
      titulo,
      resposta,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em postPergunta:", err);
    throw err;
  }
}
