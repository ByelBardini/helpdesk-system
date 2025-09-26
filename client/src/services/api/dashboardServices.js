import { api } from "../api.js";

export async function getDashboard() {
  try {
    const response = await api.get("/dashboard");

    return response.data;
  } catch (err) {
    console.error("Erro em getDashboard:", err);
    throw err;
  }
}
