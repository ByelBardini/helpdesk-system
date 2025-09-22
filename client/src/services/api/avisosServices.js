import { api } from "../api.js";

export async function getAvisos() {
  try {
    const response = await api.get("/aviso");

    return response.data;
  } catch (err) {
    console.error("Erro em getAvisos:", err);
    throw err;
  }
}
