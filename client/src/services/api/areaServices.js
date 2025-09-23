import { api } from "../api.js";

export async function getAreas() {
  try {
    const response = await api.get("/area");

    return response.data;
  } catch (err) {
    console.error("Erro em getAreas:", err);
    throw err;
  }
}
