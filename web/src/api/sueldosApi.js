import axiosInstance from "./axiosInstance";

export const altaSueldo = async (sueldoData) => {
  try {
    const response = await axiosInstance.post("/sueldos/", sueldoData);
    return response.data; 
  } catch (error) {
    console.error("Error al crear sueldo:", error);
    throw error; 
  }
};

export const obtenerSueldoPorUsuario = async (id_usuario) => {
  try {
    const response = await axiosInstance.get(`/sueldos/usuario/${id_usuario}`);
    return response.data;
  } catch (err) {
    console.error("Error al obtener sueldo del usuario:", err);
    throw err;
  }
};

export const modificarSueldo = async (id_sueldo, sueldoData) => {
  try {
    const response = await axiosInstance.put(`/sueldos/${id_sueldo}`, sueldoData);
    return response.data; 
  } catch (err) {
    console.error("Error al modificar el sueldo:", err);
    throw err; 
  }
};

export const bajaSueldo = async (id_sueldo) => {
  try {
    const response = await axiosInstance.delete(`/sueldos/${id_sueldo}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar sueldo:", error);
    throw error;
  }
};

