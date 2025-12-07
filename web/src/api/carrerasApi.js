import { materias, materias_carrera } from "@/data/mockData";
import axios from "axios";

const API_BASE_URL =
  "https://jtseq9puk0.execute-api.us-east-1.amazonaws.com/api";

let mockMateriasPorCarrera = [...materias_carrera];
let materiasData = [...materias];

export const altaCarrera = async (carreraData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/carreras`, carreraData, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear carrera:", error);
    throw error;
  }
};

export const bajaCarrera = async (uuid) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/carreras/${uuid}`, {
      headers: {
        accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar carrera", error);
    throw error;
  }
};

export const modificarCarrera = async (uuid, carreraData) => {
  try {
    console.log("API - UUID:", uuid);
    console.log("API - Datos a enviar:", carreraData);
    const response = await axios.put(
      `${API_BASE_URL}/carreras/${uuid}`,
      carreraData,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API - Respuesta:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error al modificar la carrera", err);
    console.error("Error response:", err.response?.data);
    throw err;
  }
};

export const carreraPorId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/carreras/${id}`, {
      headers: {
        accept: "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error al buscar carrera", err);
    throw err;
  }
};

export const carreraPorNombre = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/carreras`, {
      params: { name_carrera: name },
      headers: {
        accept: "application/json",
      },
    });

    // La API devuelve { success: true, data: [...] }
    const carreras = response.data.data || [];

    if (carreras.length === 0) throw new Error("Carrera no encontrada");

    // Retornar la primera carrera encontrada
    return carreras[0];
  } catch (err) {
    console.error("Error al buscar carrera", err);
    throw err;
  }
};

export const obtenerCarreras = async (page = 1, limit = 100) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/carreras`, {
      params: { page, limit },
      headers: {
        accept: "application/json",
      },
    });

    // La API devuelve { success: true, data: [...], page, limit, count, totalCount, totalPages }
    return response.data.data || [];
  } catch (err) {
    console.error("Error al obtener carreras", err);
    throw err;
  }
};

export const obtenerMateriasPorCarrera = async (id_carrera) => {
  try {
    const relaciones = mockMateriasPorCarrera.filter(
      (rel) => rel.id_carrera === id_carrera
    );

    if (relaciones.length === 0) {
      return Promise.resolve([]);
    }

    const materias = relaciones.map((rel) => {
      return materiasData.find((m) => m.id_materia === rel.id_materia);
    });

    return Promise.resolve(materias);
  } catch (err) {
    console.error("Error al obtener materias por carrera:", err);
    throw err;
  }
};

export const verMateriasPorCarrera = async (uuid_carrera) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/materias`, {
      params: { uuid_carrera },
      headers: {
        accept: "application/json",
      },
    });

    // La API devuelve { success: true, data: [...] }
    return response.data.data || [];
  } catch (err) {
    console.error("Error al obtener materias por carrera:", err);
    throw err;
  }
};
