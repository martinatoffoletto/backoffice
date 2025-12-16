import axiosInstance from "./axiosInstance";

export const altaSede = async (sedeData) => {
  try {
    const response = await axiosInstance.post("/sedes/", sedeData);
    return response.data; 
  } catch (error) {
    console.error("Error al crear sede:", error);
    throw error; 
  }
};

export const bajaSede = async (id) => {
  try {
    const response = await axiosInstance.delete(`/sedes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar sede:", error);
    throw error;
  }
};

export const actualizarSede = async (id, sedeData) => {
  try {
    const response = await axiosInstance.patch(`/sedes/${id}`, sedeData);
    return response.data; 
  } catch (err) {
    console.error("Error al modificar la sede:", err);
    throw err; 
  }
};

export const modifcarSede = actualizarSede;

export const sedePorId = async (id) => {
  try {
    const response = await axiosInstance.get(`/sedes/${id}`);       
    return response.data;
  } catch (err) {
    console.error("Error al buscar sede:", err);
    throw err;
  }
};

export const obtenerSedes = async (skip = 0, limit = 100, status_filter = null) => {
  try {
    const params = { skip, limit };
    if (status_filter !== null) {
      params.status_filter = status_filter;
    }
    const response = await axiosInstance.get("/sedes/", { params });
    console.log("Sedes obtenidas: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener sedes:", error);
    throw error;
  }
};

export const buscarSedes = async (param, value, skip = 0, limit = 100) => {
  try {
    const params = { param, value, skip, limit };
    const response = await axiosInstance.get("/sedes/", { params });
    return response.data;
  } catch (error) {
    console.error("Error al buscar sedes:", error);
    throw error;
  }
};