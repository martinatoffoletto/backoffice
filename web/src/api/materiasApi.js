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


let mockMaterias=[...materias];
let mockCarreras=[...carreras];
let mockMateriaPorCarrera=[...materias_carrera];

export const altaMateria = async (materiaData, carreras_materia) => {
  try {
    const nuevaMateria = {
      id: mockMaterias.length + 1, // simulamos autoincremental
      ...materiaData,
    };

    mockMaterias.push(nuevaMateria);
    return Promise.resolve(nuevaMateria); 
  } catch (error) {
    console.error("Error al crear materia:", error);
    throw error; 
  }
};

export const bajaMateria = async (id) => {
  try {
    mockMaterias = mockMaterias.filter((s) => s.id !== id);
    return Promise.resolve({message:"Materia eliminada exitosamente"});
  } catch (error) {
    console.error("Error al eliminar materia:", error);
    throw error;
  }
};

export const modificarMateria = async (id, materiaData) => {
  try {
    const index = mockMaterias.findIndex((s)=>s.id_materia === id)
    if (index === -1) throw new Error("Materia no encontrado");
    mockMaterias[index] = { ...mockMaterias[index], ...materiaData };
    return Promise.resolve(mockMaterias[index]); 
  } catch (err) {
    console.error("Error al modificar el materia:", err);
    throw err; 
}
};

export const materiaPorId=async(id)=>{
    try{
        console.log(id)
        const materia= mockMaterias.find((m)=>m.id_materia === id)
        if (!materia) throw new Error("Materia no encontrada")       
        return Promise.resolve(materia)
    }catch(err){
        console.error("Error al buscar materia:", err)
        throw err;
    }
}

export const obtenerMaterias = async () => {
  try {
    return Promise.resolve(mockMaterias);
  } catch (error) {
    console.error("Error al obtener materias:", error);
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