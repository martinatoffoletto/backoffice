import axiosInstance from "./axiosInstance";

// NOTA: El endpoint /events no existe en el backend actual
// Este módulo está comentado hasta que se implemente el endpoint correspondiente
// Si necesitas eventos, deberás crear el endpoint en el backend primero

export const getEventos = async () => {
  try {
    // TODO: Implementar cuando el endpoint esté disponible en el backend
    // const response = await axiosInstance.get("/events");
    // return response.data;
    
    console.warn("El endpoint /events no está disponible en el backend");
    return [];
  } catch (err) {
    console.error("Error al obtener eventos:", err);
    throw err; 
  }
};