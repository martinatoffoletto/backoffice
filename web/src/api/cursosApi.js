import coreApiInstance from "./coreApiInstance";

// eslint-disable-next-line no-unused-vars
export const altaCurso = async (cursoData) => {
  try {
    const response = await coreApiInstance.post("/cursos", cursoData, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear curso:", error);
    throw error;
  }
};

export const bajaCurso = async (uuid) => {
  try {
    const response = await coreApiInstance.delete(`/cursos/${uuid}`, {
      headers: {
        accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    throw error;
  }
};

export const modificarCurso = async (uuid, cursoData) => {
  try {
    const response = await coreApiInstance.put(`/cursos/${uuid}`, cursoData, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error al modificar el curso:", err);
    throw err;
  }
};

export const cursoPorId = async (uuid) => {
  try {
    const response = await coreApiInstance.get(`/cursos/${uuid}`, {
      headers: {
        accept: "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error al buscar curso:", err);
    throw err;
  }
};

export const buscarCurso = async (uuid_materia, turno_curso, sede_curso) => {
  try {
    const response = await coreApiInstance.get("/cursos", {
      params: {
        uuid_materia: uuid_materia,
        turno_curso: turno_curso,
        sede_curso: sede_curso,
      },
      headers: {
        accept: "application/json",
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error al buscar curso:", err);
    throw err;
  }
};

export const obtenerCursos = async () => {
  try {
    const response = await coreApiInstance.get("/cursos", {
      headers: {
        accept: "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    throw error;
  }
};
