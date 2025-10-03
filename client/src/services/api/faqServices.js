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
