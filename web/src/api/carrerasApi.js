import { carreras} from "@/data/mockData";
import axios from "axios";

let mockCarreras=[...carreras];

export const altaCarrera = async (carreraData) => {
  try {
    const nuevaCarrera = {
      id: mockCarreras.length + 1, // simulamos autoincremental
      ...carreraData,
    };

    mockCarreras.push(nuevaCarrera);
    return Promise.resolve(nuevaCarrera); 
  } catch (error) {
    console.error("Error al crear carrera:", error);
    throw error; 
  }
};

export const bajaCarrera = async (id) => {
  try {
    mockCarreras = mockCarreras.filter((s) => s.id !== id);
    return Promise.resolve({message:"Carrera eliminada exitosamente"});
  } catch (error) {
    console.error("Error al eliminar carrera", error);
    throw error;
  }
};

export const modificarCarrera = async (id, carreraData) => {
  try {
    const index = mockCarreras.findIndex((s)=>s.id_carrera === id)
    if (index === -1) throw new Error("Carrera no encontrado");
    mockCarreras[index] = { ...mockCarreras[index], ...carreraData };
    return Promise.resolve(mockCarreras[index]); 
  } catch (err) {
    console.error("Error al modificar el carrera", err);
    throw err; 
}
};

export const carreraPorId=async(id)=>{
    try{
        console.log(id)
        const carrera= mockCarreras.find((m)=>m.id_carrera === id)
        if (!carrera) throw new Error("Carrera no encontrada")       
        return Promise.resolve(carrera)
    }catch(err){
        console.error("Error al buscar carrera", err)
        throw err;
    }
}


export const obtenerCarreras=async()=>{
  try{
    return Promise.resolve(mockCarreras)
  }catch(err){
    console.error("Error al obtener carreras", err)
    throw err
  }
}