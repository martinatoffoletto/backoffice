// import axiosInstance from "./axiosInstance";

// export const altaCurso = async (cursoData) => {
//   try {
//     const response = await axiosInstance.post("/cursos/", cursoData);
//     return response.data; 
//   } catch (error) {
//     console.error("Error al crear curso:", error);
//     throw error; 
//   }
// };

// export const bajaCurso = async (id) => {
//   try {
//     const response = await axiosInstance.delete(`/cursos/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error al eliminar curso:", error);
//     throw error;
//   }
// };

// export const modificarCurso = async (id, cursoData) => {
//   try {
//     const response = await axiosInstance.put(`/cursos/${id}`, cursoData);
//     return response.data; 
//   } catch (err) {
//     console.error("Error al modificar el curso:", err);
//     throw err; 
// }
// };

// export const cursoPorId=async(id)=>{
//     try{
//         const response= await axiosInstance.get(`/cursos/${id}`)       
//         return response.data
//     }catch(err){
//         console.error("Error al buscar curso:", err)
//         throw err;
//     }
// }

import { carreras,  cursos, materias_carrera } from "@/data/mockData";
import axios from "axios";

let mockCursos=[...cursos];
let mockCarreras=[...carreras];
let mockMateriaPorCarrera=[...materias_carrera];

export const altaCurso = async (materiaData, carreras_materia) => {
  try {
    const nuevoCurso = {
      id: mockCursos.length + 1, // simulamos autoincremental
      ...materiaData,
    };

    mockCursos.push(nuevoCurso);
    return Promise.resolve(nuevoCurso); 
  } catch (error) {
    console.error("Error al crear curso:", error);
    throw error; 
  }
};

export const bajaCurso = async (id) => {
  try {
    mockCursos = mockCursos.filter((s) => s.id_curso !== id);
    return Promise.resolve({message:"Curso eliminada exitosamente"});
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    throw error;
  }
};

export const modificarCurso = async (id, cursoData) => {
  try {
    const index = mockCursos.findIndex((s)=>s.id_curso === id)
    if (index === -1) throw new Error("Curso no encontrado");
    mockCursos[index] = { ...mockCursos[index], ...cursoData };
    return Promise.resolve(mockCursos[index]); 
  } catch (err) {
    console.error("Error al modificar el curso:", err);
    throw err; 
}
};

export const cursoPorId=async(id)=>{
    try{
        console.log(id)
        const curso= mockCursos.find((m)=>m.id_curso === id)
        console.log(curso)
        if (!curso) throw new Error("Curso no encontrada")       
        return Promise.resolve(curso)
    }catch(err){
        console.error("Error al buscar curso:", err)
        throw err;
    }
}

export const obtenerCursos = async () => {
  try {
    return Promise.resolve(mockCursos);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    throw error;
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