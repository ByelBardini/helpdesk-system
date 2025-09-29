import { api } from "../api.js";

export async function getUsuarios() {
  try {
    const response = await api.get("/usuario");

    return response.data;
  } catch (err) {
    console.error("Erro em getUsuarios:", err);
    throw err;
  }
}

export async function putUsuarios(id, setor, role) {
  try {
    const response = await api.put(`/usuario/${id}`, {
      setor_nome: setor,
      usuario_role: role,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em putUsuarios:", err);
    throw err;
  }
}

export async function resetaSenha(id) {
  try {
    const response = await api.put(`/usuario/senha/reseta/${id}`);

    return response.data;
  } catch (err) {
    console.error("Erro em resetaSenha:", err);
    throw err;
  }
}

export async function ativaInativa(id) {
  try {
    const response = await api.put(`/usuario/inativa/${id}`);

    return response.data;
  } catch (err) {
    console.error("Erro em ativaInativa:", err);
    throw err;
  }
}

export async function getDados() {
  try {
    const response = await api.get(`/usuario/dados`);

    return response.data;
  } catch (err) {
    console.error("Erro em buscaDados:", err);
    throw err;
  }
}
