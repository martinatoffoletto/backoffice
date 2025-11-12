import axiosInstance from "./axiosInstance";

export const asociarCarreraUsuario = async (assignmentData) => {
  try {
    const response = await axiosInstance.post("/usuarios-carreras/", assignmentData);
    return response.data; 
  } catch (error) {
    console.error("Error al asociar carrera al usuario:", error);
    throw error; 
  }
};

export const obtenerCarreraPorUsuario = async (id_usuario) => {
  try {
    const response = await axiosInstance.get(`/usuarios-carreras/usuario/${id_usuario}`);
    return response.data;
  } catch (err) {
    console.error("Error al obtener carrera del usuario:", err);
    throw err;
  }
};

export const eliminarCarreraUsuario = async (id_usuario, id_carrera) => {
  try {
    const response = await axiosInstance.delete(`/usuarios-carreras/${id_usuario}/${id_carrera}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar carrera del usuario:", error);
    throw error;
  }
};

