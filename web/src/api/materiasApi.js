// NOTA: El endpoint /materias no existe en el backend actual
// Este módulo está usando datos mock temporalmente
// Para conectarlo al backend, primero se debe crear el endpoint /api/v1/materias en el backend

// import axiosInstance from "./axiosInstance";

// export const altaMateria = async (materiaData) => {
//   try {
//     const response = await axiosInstance.post("/materias/", materiaData);
//     return response.data; 
//   } catch (error) {
//     console.error("Error al crear materia:", error);
//     throw error; 
//   }
// };

// export const bajaMateria = async (id) => {
//   try {
//     const response = await axiosInstance.delete(`/materias/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error al eliminar materia:", error);
//     throw error;
//   }
// };

// export const modificarMateria = async (id, materiaData) => {
//   try {
//     const response = await axiosInstance.put(`/materias/${id}`, materiaData);
//     return response.data; 
//   } catch (err) {
//     console.error("Error al modificar el materia:", err);
//     throw err; 
// }
// };

// export const materiaPorId=async(id)=>{
//     try{
//         const response= await axiosInstance.get(`/materias/${id}`)       
//         return response.data
//     }catch(err){
//         console.error("Error al buscar materia:", err)
//         throw err;
//     }
// }


import { CARRERAS_MOCK } from "@/constants/formConstants";
import { carreras,  materias, materias_carrera } from "@/data/mockData";
import axios from "axios";

const API_BASE_URL =
  "https://jtseq9puk0.execute-api.us-east-1.amazonaws.com/api";

let mockMaterias=[...materias];
let mockCarreras=[...carreras];
let mockMateriaPorCarrera=[...materias_carrera];

export const altaMateria = async (materiaData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/materias`, materiaData, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear materia:", error);
    throw error;
  }
};

export const bajaMateria = async (uuid) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/materias/${uuid}`, {
      headers: {
        accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar materia", error);
    throw error;
  }
};

export const modificarMateria = async (uuid, materiaData) => {
  try {
    console.log("API - UUID:", uuid);
    console.log("API - Datos a enviar:", materiaData);
    const response = await axios.put(
      `${API_BASE_URL}/materias/${uuid}`,
      materiaData,
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
    console.error("Error al modificar la materia", err);
    console.error("Error response:", err.response?.data);
    throw err;
  }
};

export const materiaPorId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/materias/${id}`, {
      headers: {
        accept: "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error al buscar materia", err);
    throw err;
  }
};
export const materiaPorNombre = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/materias`, {
      params: { name_materia: name },
      headers: {
        accept: "application/json",
      },
    });

    // La API devuelve { success: true, data: [...] }
    const materias = response.data.data || [];

    if (materias.length === 0) throw new Error("Materia no encontrada");

    // Retornar la primera materia encontrada
    return materias[0];
  } catch (err) {
    console.error("Error al buscar materia", err);
    throw err;
  }
};

export const obtenerMaterias = async (page = 1, limit = 100) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/materias`, {
      params: { page, limit },
      headers: {
        accept: "application/json",
      },
    });

    // La API devuelve { success: true, data: [...], page, limit, count, totalCount, totalPages }
    return response.data.data || [];
  } catch (err) {
    console.error("Error al obtener materias", err);
    throw err;
  }
};

export const obtenerCarrerasPorMateria = async (id) => {
  try {
    // Buscar todas las relaciones entre esa materia y las carreras
    const carrerasPorMateria = mockMateriaPorCarrera.filter(
      (mc) => mc.id_materia === id
    );

    // Obtener todas las carreras correspondientes a esas relaciones
    const carreras = carrerasPorMateria.map((rel) =>
      mockCarreras.find((c) => c.id_carrera === rel.id_carrera)
    );

    // Filtrar posibles null si alguna carrera no se encontró
    const carrerasValidas = carreras.filter((c) => c);
    console.log(carrerasValidas)
    return carrerasValidas;
  } catch (error) {
    console.error("Error al obtener carreras por materia:", error);
    throw error;
  }
};


export const obtenerCarreras=async()=>{
  try{
    return Promise.resolve(mockCarreras)
  }catch(err){
    console.error("Error al obtener carreras:", err)
    throw err
  }
}