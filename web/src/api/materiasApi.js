import coreApiInstance from "./coreApiInstance";

export const altaMateria = async (materiaData) => {
  try {
    const response = await coreApiInstance.post("/materias", materiaData, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear materia:", error);
    throw error;
  }
};

export const bajaMateria = async (uuid) => {
  try {
    const response = await coreApiInstance.delete(`/materias/${uuid}`, {
      headers: {
        accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar materia", error);
    throw error;
  }
};

export const modificarMateria = async (uuid, materiaData) => {
  try {
    console.log("API - UUID:", uuid);
    console.log("API - Datos a enviar:", materiaData);
    const response = await coreApiInstance.put(
      `/materias/${uuid}`,
      materiaData,
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
    console.error("Error al modificar la materia", err);
    console.error("Error response:", err.response?.data);
    throw err;
  }
};

export const materiaPorId = async (id) => {
  try {
    const response = await coreApiInstance.get(`/materias/${id}`, {
      headers: {
        accept: "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error al buscar materia", err);
    throw err;
  }
};
export const materiaPorNombre = async (name) => {
  try {
    const response = await coreApiInstance.get("/materias", {
      params: { name_materia: name },
      headers: {
        accept: "application/json",
      },
    });
    const materias = response.data.data || [];

    if (materias.length === 0) throw new Error("Materia no encontrada");

    return materias[0];
  } catch (err) {
    console.error("Error al buscar materia", err);
    throw err;
  }
};

export const obtenerMaterias = async (page = 1, limit = 100) => {
  try {
    const response = await coreApiInstance.get("/materias", {
      params: { page, limit },
      headers: {
        accept: "application/json",
      },
    });

    return response.data.data || [];
  } catch (err) {
    console.error("Error al obtener materias", err);
    throw err;
  }
};

export const obtenerCorrelativas = async (uuid) => {
  try {
    const response = await coreApiInstance.get(
      `/materias/${uuid}/correlativas`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    return response.data.data || [];
  } catch (err) {
    console.error("Error al obtener correlativas", err);
    throw err;
  }
};

export const agregarCorrelativa = async (uuid, correlativaData) => {
  try {
    const response = await coreApiInstance.post(
      `/materias/${uuid}/correlativas`,
      correlativaData,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error al agregar correlativa", err);
    throw err;
  }
};

export const eliminarCorrelativa = async (uuid, uuidCorrelativa) => {
  try {
    const response = await coreApiInstance.delete(
      `/materias/${uuid}/correlativas/${uuidCorrelativa}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error al eliminar correlativa", err);
    throw err;
  }
};
