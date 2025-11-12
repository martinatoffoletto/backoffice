// NOTA: El endpoint /cursos no existe en el backend actual
// Este módulo está usando datos mock temporalmente
// Para conectarlo al backend, primero se debe crear el endpoint /api/v1/cursos en el backend

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

let mockCursos=[...cursos];
let mockCarreras=[...carreras];
let mockMateriaPorCarrera=[...materias_carrera];

// eslint-disable-next-line no-unused-vars
export const altaCurso = async (materiaData, carreras_materia) => {
  try {
    // carreras_materia no se usa en modo mock, pero se mantiene para compatibilidad
    const curso_id = materiaData.id_curso && materiaData.id_curso.trim()
      ? materiaData.id_curso
      : (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `cur-${Date.now()}`);
    const nuevoCurso = {
      ...materiaData,
      id: curso_id,
      id_curso: curso_id,
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
    mockCursos = mockCursos.filter(
      (s) => (s.id_curso || s.id) !== id
    );
    return Promise.resolve({message:"Curso eliminada exitosamente"});
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    throw error;
  }
};

export const modificarCurso = async (id, cursoData) => {
  try {
    const index = mockCursos.findIndex(
      (s)=> (s.id_curso || s.id) === id
    )
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
        const curso= mockCursos.find(
          (m)=> (m.id_curso || m.id) === id
        )
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
    return Promise.resolve([...mockCursos]);
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