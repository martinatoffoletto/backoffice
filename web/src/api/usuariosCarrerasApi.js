import axiosInstance from "./axiosInstance";

// GET ALL - Obtener todas las relaciones con filtros
export const obtenerUsuariosCarreras = async (
  skip = 0,
  limit = 100,
  param = null,
  value = null,
  status_filter = null
) => {
  try {
    const params = { skip, limit };
    if (param !== null && value !== null) {
      params.param = param;
      params.value = value;
    }
    if (status_filter !== null) {
      params.status_filter = status_filter;
    }
    const response = await axiosInstance.get("/usuarios-carreras/", { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener relaciones usuario-carrera:", error);
    throw error;
  }
};

// CREATE - Asociar una carrera a un usuario
export const asociarCarreraUsuario = async (assignmentData) => {
  try {
    const response = await axiosInstance.post(
      "/usuarios-carreras/",
      assignmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error al asociar carrera al usuario:", error);
    throw error;
  }
};

// UPDATE - Modificar la carrera asignada (solo se cambia id_carrera)
export const modificarCarreraUsuario = async (
  id_usuario,
  id_carrera_antigua,
  id_carrera_nueva
) => {
  try {
    const response = await axiosInstance.put(
      `/usuarios-carreras/${id_usuario}/${id_carrera_antigua}`,
      null,
      { params: { id_carrera_nueva } }
    );
    return response.data;
  } catch (error) {
    console.error("Error al modificar carrera del usuario:", error);
    throw error;
  }
};

// DELETE - Eliminar relación usuario-carrera
export const eliminarCarreraUsuario = async (id_usuario, id_carrera) => {
  try {
    const response = await axiosInstance.delete(
      `/usuarios-carreras/${id_usuario}/${id_carrera}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar carrera del usuario:", error);
    throw error;
  }
};
