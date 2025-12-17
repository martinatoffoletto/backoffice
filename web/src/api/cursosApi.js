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

/**
 * Obtiene las inscripciones de un curso (estudiantes y profesores)
 * Endpoint: GET /api/inscripciones?uuid_curso={uuid}
 * La respuesta ya incluye el objeto user completo en cada inscripción
 * @param {string} uuid_curso - UUID del curso
 * @returns {Promise<Array>} Lista de inscripciones con user incluido
 */
export const obtenerInscripcionesPorCurso = async (uuid_curso) => {
  try {
    const response = await coreApiInstance.get("/inscripciones", {
      params: {
        uuid_curso: uuid_curso,
      },
      headers: {
        accept: "application/json",
      },
    });
    // La respuesta viene como { success, data: [...], page, limit, count, totalCount, totalPages }
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener inscripciones del curso:", error);
    // Retornar array vacío si falla
    return [];
  }
};

/**
 * Obtiene un curso con sus docentes enriquecidos
 * Las inscripciones ya incluyen el objeto user completo, no necesitamos llamadas adicionales
 * @param {string} uuid_curso - UUID del curso
 * @returns {Promise<Object>} Curso con docentes_enriquecidos
 */
export const cursoPorIdConDocentes = async (uuid_curso) => {
  try {
    // 1. Obtener curso básico e inscripciones en paralelo
    const [curso_response, inscripciones] = await Promise.all([
      coreApiInstance.get(`/cursos/${uuid_curso}`, {
        headers: { accept: "application/json" },
      }),
      obtenerInscripcionesPorCurso(uuid_curso),
    ]);

    const curso = curso_response.data;

    // 2. Filtrar solo profesores (TITULAR y AUXILIAR)
    // Cada inscripción ya incluye el objeto user completo
    const titular_inscripcion = inscripciones.find((i) => i.rol === "TITULAR");
    const auxiliar_inscripcion = inscripciones.find((i) => i.rol === "AUXILIAR");

    // 3. Construir objetos de docentes con los datos que ya vienen en la inscripción
    const docentes_enriquecidos = {
      titular: titular_inscripcion?.user
        ? {
            user_uuid: titular_inscripcion.user_uuid,
            nombre: titular_inscripcion.user.nombre,
            apellido: titular_inscripcion.user.apellido,
            nombre_completo: `${titular_inscripcion.user.nombre} ${titular_inscripcion.user.apellido}`,
            email: titular_inscripcion.user.email,
            legajo: titular_inscripcion.user.legajo,
          }
        : null,
      auxiliar: auxiliar_inscripcion?.user
        ? {
            user_uuid: auxiliar_inscripcion.user_uuid,
            nombre: auxiliar_inscripcion.user.nombre,
            apellido: auxiliar_inscripcion.user.apellido,
            nombre_completo: `${auxiliar_inscripcion.user.nombre} ${auxiliar_inscripcion.user.apellido}`,
            email: auxiliar_inscripcion.user.email,
            legajo: auxiliar_inscripcion.user.legajo,
          }
        : null,
    };

    // 4. Retornar curso con docentes enriquecidos
    return {
      ...curso,
      docentes_enriquecidos,
    };
  } catch (error) {
    console.error("Error al obtener curso con docentes:", error);
    throw error;
  }
};