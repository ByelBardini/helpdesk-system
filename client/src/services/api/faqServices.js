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
