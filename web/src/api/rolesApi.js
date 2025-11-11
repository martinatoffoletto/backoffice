import axiosInstance from "./axiosInstance";

export const obtenerRoles = async (status_filter = null) => {
  try {
    const params = {};
    if (status_filter !== null) {
      params.status_filter = status_filter;
    }
    const response = await axiosInstance.get("/roles/", { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    throw error;
  }
};

export const buscarRoles = async (param, value, status_filter = null) => {
  try {
    const params = { param, value };
    if (status_filter !== null) {
      params.status_filter = status_filter;
    }
    const response = await axiosInstance.get("/roles/search", { params });
    return response.data;
  } catch (error) {
    console.error("Error al buscar roles:", error);
    throw error;
  }
};

export const obtenerCategorias = async (status_filter = null) => {
  try {
    const params = {};
    if (status_filter !== null) {
      params.status_filter = status_filter;
    }
    const response = await axiosInstance.get("/roles/categories", { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
};

export const rolPorId = async (id) => {
  try {
    const response = await axiosInstance.get("/roles/", {
      params: { param: "id", value: id },
    });
    return response.data[0] || null;
  } catch (err) {
    console.error("Error al buscar rol:", err);
    throw err;
  }
};

export const altaRol = async (rolData) => {
  try {
    const response = await axiosInstance.post("/roles/", rolData);
    return response.data;
  } catch (error) {
    console.error("Error al crear rol:", error);
    throw error;
  }
};

export const bajaRol = async (id) => {
  try {
    const response = await axiosInstance.delete(`/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    throw error;
  }
};

export const modificarRol = async (id, rolData) => {
  try {
    const response = await axiosInstance.put(`/roles/${id}`, rolData);
    return response.data;
  } catch (err) {
    console.error("Error al modificar el rol:", err);
    throw err;
  }
};
