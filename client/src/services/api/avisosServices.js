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

export async function deleteAviso(id) {
  try {
    const response = await api.delete(`/aviso/${id}`);

    return response.data;
  } catch (err) {
    console.error("Erro em deleteAviso:", err);
    throw err;
  }
}

export async function postAviso(importancia, titulo, descricao) {
  try {
    const response = await api.post("/aviso/", {
      importancia,
      titulo,
      descricao,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em postAviso:", err);
    throw err;
  }
}
