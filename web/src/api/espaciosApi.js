import axiosInstance from "./axiosInstance";

export const altaEspacio = async (espacioData) => {
  try {
    const response = await axiosInstance.post("/espacios/", espacioData);
    return response.data;
  } catch (error) {
    console.error("Error al crear espacio:", error);
    throw error;
  }
};

export const bajaEspacio = async (id) => {
  try {
    const response = await axiosInstance.delete(`/espacios/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar espacio:", error);
    throw error;
  }
};

export const actualizarEspacio = async (id, espacioData) => {
  try {
    const response = await axiosInstance.patch(`/espacios/${id}`, espacioData);
    return response.data;
  } catch (err) {
    console.error("Error al modificar el espacio:", err);
    throw err;
  }
};

export const modificarEspacio = actualizarEspacio;

export const espacioPorId = async (id) => {
  try {
    const response = await axiosInstance.get(`/espacios/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error al buscar espacio:", err);
    throw err;
  }
};

export const obtenerEspacios = async (
  skip = 0,
  limit = 100,
  status_filter = null
) => {
  try {
    const params = { skip, limit };
    if (status_filter !== null) {
      params.status_filter = status_filter;
    }
    const response = await axiosInstance.get("/espacios/", { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener espacios:", error);
    throw error;
  }
};

export const buscarEspacios = async (param, value, skip = 0, limit = 100) => {
  try {
    const params = { param, value, skip, limit };
    const response = await axiosInstance.get("/espacios/", { params });
    return response.data;
  } catch (error) {
    console.error("Error al buscar espacios:", error);
    throw error;
  }
};
