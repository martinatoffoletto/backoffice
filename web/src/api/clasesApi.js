import axiosInstance from "./axiosInstance";

export const altaClase = async (claseData) => {
  try {
    const response = await axiosInstance.post("/clases-individuales/", claseData);
    return response.data; 
  } catch (error) {
    console.error("Error al crear clase:", error);
    throw error; 
  }
};

export const obtenerClasesPorCurso = async (id_curso, status_filter = null) => {
  try {
    const params = {};
    if (status_filter !== null) {
      params.status = status_filter;
    }
    const response = await axiosInstance.get(`/clases-individuales/curso/${id_curso}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener clases del curso:", error);
    throw error;
  }
};

export const obtenerClases = async (skip = 0, limit = 100, status_filter = null) => {
  try {
    const params = { skip, limit };
    if (status_filter !== null) {
      params.status = status_filter;
    }
    const response = await axiosInstance.get("/clases-individuales/", { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener clases:", error);
    throw error;
  }
};

export const modificarClase = async (id_clase, claseData) => {
  try {
    const response = await axiosInstance.put(`/clases-individuales/${id_clase}`, claseData);
    return response.data; 
  } catch (err) {
    console.error("Error al modificar la clase:", err);
    throw err; 
  }
};

export const bajaClase = async (id_clase) => {
  try {
    const response = await axiosInstance.delete(`/clases-individuales/${id_clase}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar clase:", error);
    throw error;
  }
};

export const cambiarEstadoClase = async (id_clase, nuevo_estado) => {
  try {
    const response = await axiosInstance.patch(`/clases-individuales/${id_clase}/estado?nuevo_estado=${nuevo_estado}`);
    return response.data;
  } catch (error) {
    console.error("Error al cambiar estado de la clase:", error);
    throw error;
  }
};

