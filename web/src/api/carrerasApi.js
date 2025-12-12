import coreApiInstance from "./coreApiInstance";

export const altaCarrera = async (carreraData) => {
  try {
    const response = await coreApiInstance.post("/carreras", carreraData, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear carrera:", error);
    throw error;
  }
};

export const bajaCarrera = async (uuid) => {
  try {
    const response = await coreApiInstance.delete(`/carreras/${uuid}`, {
      headers: {
        accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar carrera", error);
    throw error;
  }
};

export const modificarCarrera = async (uuid, carreraData) => {
  try {
    console.log("API - UUID:", uuid);
    console.log("API - Datos a enviar:", carreraData);
    const response = await coreApiInstance.put(
      `/carreras/${uuid}`,
      carreraData,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API - Respuesta:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error al modificar la carrera", err);
    console.error("Error response:", err.response?.data);
    throw err;
  }
};

export const carreraPorId = async (id) => {
  try {
    const response = await coreApiInstance.get(`/carreras/${id}`, {
      headers: {
        accept: "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error al buscar carrera", err);
    throw err;
  }
};

export const carreraPorNombre = async (name) => {
  try {
    const response = await coreApiInstance.get("/carreras", {
      params: { name_carrera: name },
      headers: {
        accept: "application/json",
      },
    });

    const carreras = response.data.data || [];

    if (carreras.length === 0) throw new Error("Carrera no encontrada");

    return carreras[0];
  } catch (err) {
    console.error("Error al buscar carrera", err);
    throw err;
  }
};

export const obtenerCarreras = async (page = 1, limit = 100) => {
  try {
    const response = await coreApiInstance.get("/carreras", {
      params: { page, limit },
      headers: {
        accept: "application/json",
      },
    });

    return response.data.data || [];
  } catch (err) {
    console.error("Error al obtener carreras", err);
    throw err;
  }
};

export const verMateriasPorCarrera = async (uuid_carrera) => {
  try {
    const response = await coreApiInstance.get("/materias", {
      params: { uuid_carrera },
      headers: {
        accept: "application/json",
      },
    });

    return response.data.data || [];
  } catch (err) {
    console.error("Error al obtener materias por carrera:", err);
    throw err;
  }
};
