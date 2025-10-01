import { api } from "../api.js";

export async function postCompras(
  empresa_id,
  setor_id,
  solicitante_id,
  item,
  quantidade,
  motivo,
  tipo
) {
  try {
    const response = await api.post(`/compra`, {
      empresa_id,
      setor_id,
      solicitante_id,
      item,
      quantidade,
      motivo,
      tipo,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em postCompras:", err);
    throw err;
  }
}

export async function getCompras(id) {
  try {
    const response = await api.get(`/compra/${id}`);

    return response.data;
  } catch (err) {
    console.error("Erro em getCompras:", err);
    throw err;
  }
}

export async function putStatus(id, status, alt = null) {
  try {
    const response = await api.put(`/compra/status/${id}`, {
      status,
      alt,
    });

    return response.data;
  } catch (err) {
    console.error("Erro em putStatus:", err);
    throw err;
  }
}

export async function putRecebimento(id) {
  try {
    const response = await api.put(`/compra/recebimento/${id}`);

    return response.data;
  } catch (err) {
    console.error("Erro em putRecebimento:", err);
    throw err;
  }
}
