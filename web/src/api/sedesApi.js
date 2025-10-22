// import axiosInstance from "./axiosInstance";

// export const getAllSedes= async()=>{
//   try{
//     const response=await axios.get("/sedes")
//     return response.data
//   }catch(err){
//     console.log("Error al obtener sedes")
//     throw err
//   }
// }

// export const altaSede = async (sedeData) => {
//   try {
//     const response = await axiosInstance.post("/sedes/", sedeData);
//     return response.data; 
//   } catch (error) {
//     console.error("Error al crear sede:", error);
//     throw error; 
//   }
// };

// export const bajaSede = async (id) => {
//   try {
//     const response = await axiosInstance.delete(`/sedes/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error al eliminar sede:", error);
//     throw error;
//   }
// };

// export const modifcarSede = async (id, sedeData) => {
//   try {
//     const response = await axiosInstance.put(`/sedes/${id}`, sedeData);
//     return response.data; 
//   } catch (err) {
//     console.error("Error al modificar el sede:", err);
//     throw err; 
// }
// };

// export const sedePorId=async(id)=>{
//     try{
//         const response= await axiosInstance.get(`/sedes/${id}`)       
//         return response.data
//     }catch(err){
//         console.error("Error al buscar sede:", err)
//         throw err;
//     }
// }

import { sedes } from "@/data/mockData";
import axios from "axios";

let mockSedes=[...sedes];

export const altaSede = async (sedeData) => {
  try {
    const nuevaSede = {
      id: mockSedes.length + 1, // simulamos autoincremental
      ...sedeData,
    };
    mockSedes.push(nuevaSede);
    return Promise.resolve(nuevaSede); 
  } catch (error) {
    console.error("Error al crear sede:", error);
    throw error; 
  }
};

export const bajaSede = async (id) => {
  try {
    mockSedes = mockSedes.filter((s) => s.id !== id);
    return Promise.resolve({message:"Sede eliminada exitosamente"});
  } catch (error) {
    console.error("Error al eliminar sede:", error);
    throw error;
  }
};

export const modifcarSede = async (id, sedeData) => {
  try {
    const index = mockSedes.findIndex((s)=>s.id === id)
    if (index === -1) throw new Error("Sede no encontrado");
    mockSedes[index] = { ...mockSedes[index], ...sedeData };
    return Promise.resolve(mockSedes[index]); 
  } catch (err) {
    console.error("Error al modificar el sede:", err);
    throw err; 
}
};

export const sedePorId=async(id)=>{
    try{
        const sede= mockSedes.find((s)=>s.id === id)
        if (!sede) throw new Error("Sede no encontrada")       
        return Promise.resolve(sede)
    }catch(err){
        console.error("Error al buscar sede:", err)
        throw err;
    }
}

export const obtenerSedes = async () => {
  try {
    return Promise.resolve(mockSedes);
  } catch (error) {
    console.error("Error al obtener sedes:", error);
    throw error;
  }
};