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

export const obtenerSueldos = async (
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
    const response = await axiosInstance.get("/sueldos/", { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener sueldos:", error);
    throw error;
  }
};

export const obtenerSueldoPorUsuario = async (id_usuario, status = null) => {
  try {
    const params = {};
    if (status !== null) {
      params.status = status;
    }
    const response = await axiosInstance.get(`/sueldos/usuario/${id_usuario}`, {
      params,
    });
    return response.data;
  } catch (err) {
    console.error("Error al obtener sueldo del usuario:", err);
    throw err;
  }
};

export const obtenerSueldoPorId = async (id_sueldo, status = null) => {
  try {
    const params = { param: "id_sueldo", value: id_sueldo };
    if (status !== null) {
      params.status_filter = status;
    }
    const response = await axiosInstance.get("/sueldos/", { params });
    return response.data[0] || null;
  } catch (err) {
    console.error("Error al obtener sueldo:", err);
    throw err;
  }
};

export const modificarSueldo = async (id_sueldo, sueldoData) => {
  try {
    const response = await axiosInstance.put(
      `/sueldos/${id_sueldo}`,
      sueldoData
    );
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
