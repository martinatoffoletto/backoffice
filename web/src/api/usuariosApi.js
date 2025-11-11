import axiosInstance from "./axiosInstance";

export const altaUsuario = async (userData) => {
  try {
    const response = await axiosInstance.post("/users/", userData);
    return response.data; 
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error; 
  }
};

export const bajaUsuario = async (id) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

export const modificarUsuario = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data; 
  } catch (err) {
    console.error("Error al modificar el usuario:", err);
    throw err; 
  }
};

export const usuarioPorId = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);       
    return response.data;
  } catch (err) {
    console.error("Error al buscar usuario:", err);
    throw err;
  }
};

export const obtenerUsuarios = async (skip = 0, limit = 100, status_filter = null) => {
  try {
    const params = { skip, limit };
    if (status_filter !== null) {
      params.status_filter = status_filter;
    }
    const response = await axiosInstance.get("/users/", { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

export const buscarUsuarios = async (param, value, skip = 0, limit = 100, status_filter = null) => {
  try {
    const params = { param, value, skip, limit };
    if (status_filter !== null) {
      params.status_filter = status_filter;
    }
    const response = await axiosInstance.get("/users/search", { params });
    return response.data;
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    throw error;
  }
};
