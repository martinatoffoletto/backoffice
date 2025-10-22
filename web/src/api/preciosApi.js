// import axiosInstance from "./axiosInstance";

// export const altaPrecio = async (precioData) => {
//   try {
//     const response = await axiosInstance.post("/params/", precioData);
//     return response.data; 
//   } catch (error) {
//     console.error("Error al crear precio:", error);
//     throw error; 
//   }
// };

// export const bajaPrecio = async (id) => {
//   try {
//     const response = await axiosInstance.delete(`/params/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error al eliminar precio:", error);
//     throw error;
//   }
// };

// export const modificarPrecio = async (id, precioData) => {
//   try {
//     const response = await axiosInstance.put(`/params/${id}`, precioData);
//     return response.data; 
//   } catch (err) {
//     console.error("Error al modificar el precio:", err);
//     throw err; 
// }
// };

// export const precioPorId=async(id)=>{
//     try{
//         const response= await axiosInstance.get(`/params/${id}`)       
//         return response.data
//     }catch(err){
//         console.error("Error al buscar precio:", err)
//         throw err;
//     }
// }

import { parametros } from "@/data/mockData";
import axios from "axios";

let mockParametros=[...parametros];

export const altaParametro = async (parametroData) => {
  try {
    const nuevoParametro = {
      id: mockParametros.length + 1, // simulamos autoincremental
      ...parametroData,
    };
    mockParametros.push(nuevoParametro);
    return Promise.resolve(nuevoParametro); 
  } catch (error) {
    console.error("Error al crear parametro:", error);
    throw error; 
  }
};

export const bajaParametro = async (id) => {
  try {
    mockParametros = mockParametros.filter((s) => s.id !== id);
    return Promise.resolve({message:"Parametro eliminada exitosamente"});
  } catch (error) {
    console.error("Error al eliminar parametro:", error);
    throw error;
  }
};

export const modifcarParametro = async (id, parametroData) => {
  try {
    const index = mockParametros.findIndex((s)=>s.id === id)
    if (index === -1) throw new Error("Parametro no encontrado");
    mockParametros[index] = { ...mockParametros[index], ...parametroData };
    return Promise.resolve(mockParametros[index]); 
  } catch (err) {
    console.error("Error al modificar el parametro:", err);
    throw err; 
}
};

export const ParametroPorId=async(id)=>{
    try{
        const parametro= mockParametros.find((s)=>s.id === id)
        if (!parametro) throw new Error("Paramtero no encontrada")       
        return Promise.resolve(parametro)
    }catch(err){
        console.error("Error al buscar parametro:", err)
        throw err;
    }
}

export const obtenerParametros = async () => {
  try {
    return Promise.resolve(mockParametros);
  } catch (error) {
    console.error("Error al obtener parametros:", error);
    throw error;
  }
};