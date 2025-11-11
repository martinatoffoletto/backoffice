import axiosInstance from "./axiosInstance";

// Nota: El backend usa "parametros" en lugar de "precios"
// Estos métodos están mapeados al endpoint /parametros del backend

export const altaParametro = async (parametroData) => {
  try {
    const response = await axiosInstance.post("/parametros/", parametroData);
    return response.data; 
  } catch (error) {
    console.error("Error al crear parametro:", error);
    throw error; 
  }
};

export const bajaParametro = async (id) => {
  try {
    const response = await axiosInstance.delete(`/parametros/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar parametro:", error);
    throw error;
  }
};

export const modifcarParametro = async (id, parametroData) => {
  try {
    const response = await axiosInstance.put(`/parametros/${id}`, parametroData);
    return response.data; 
  } catch (err) {
    console.error("Error al modificar el parametro:", err);
    throw err; 
  }
};

export const ParametroPorId = async (id) => {
  try {
    const response = await axiosInstance.get(`/parametros/${id}`);       
    return response.data;
  } catch (err) {
    console.error("Error al buscar parametro:", err);
    throw err;
  }
};

export const obtenerParametros = async (skip = 0, limit = 100, status_filter = null) => {
  try {
    const params = { skip, limit };
    if (status_filter !== null) {
      params.status_filter = status_filter;
    }
    const response = await axiosInstance.get("/parametros/", { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener parametros:", error);
    throw error;
  }
};

export const buscarParametros = async (param, value, skip = 0, limit = 100) => {
  try {
    const params = { param, value, skip, limit };
    const response = await axiosInstance.get("/parametros/search", { params });
    return response.data;
  } catch (error) {
    console.error("Error al buscar parametros:", error);
    throw error;
  }
};

export const obtenerTiposParametros = async () => {
  try {
    const response = await axiosInstance.get("/parametros/tipos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener tipos de parametros:", error);
    throw error;
  }
};

// Alias para mantener compatibilidad con código existente
export const altaPrecio = altaParametro;
export const bajaPrecio = bajaParametro;
export const modificarPrecio = modifcarParametro;
export const precioPorId = ParametroPorId;