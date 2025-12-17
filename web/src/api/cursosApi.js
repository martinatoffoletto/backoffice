import coreApiInstance from "./coreApiInstance";
import { obtenerUsuarioPorId } from "./usuariosApi";

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
 * @param {string} uuid_curso - UUID del curso
 * @returns {Promise<Array>} Lista de inscripciones con user_uuid y rol
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
    return response.data || [];
  } catch (error) {
    console.error("Error al obtener inscripciones del curso:", error);
    // Retornar array vacío si falla
    return [];
  }
};

/**
 * Obtiene un curso con sus docentes enriquecidos (similar a obtenerPropuestasPendientes)
 * Filtra las inscripciones para obtener solo TITULAR y AUXILIAR, y enriquece con datos de usuario
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
    const titular_inscripcion = inscripciones.find((i) => i.rol === "TITULAR");
    const auxiliar_inscripcion = inscripciones.find((i) => i.rol === "AUXILIAR");

    // 3. Enriquecer con datos de usuarios (en paralelo)
    const [titular_usuario, auxiliar_usuario] = await Promise.all([
      titular_inscripcion
        ? obtenerUsuarioPorId(titular_inscripcion.user_uuid).catch(() => null)
        : Promise.resolve(null),
      auxiliar_inscripcion
        ? obtenerUsuarioPorId(auxiliar_inscripcion.user_uuid).catch(() => null)
        : Promise.resolve(null),
    ]);

    // 4. Construir objetos de docentes enriquecidos
    const docentes_enriquecidos = {
      titular: titular_usuario
        ? {
            user_uuid: titular_inscripcion.user_uuid,
            nombre: titular_usuario.nombre,
            apellido: titular_usuario.apellido,
            nombre_completo: `${titular_usuario.nombre} ${titular_usuario.apellido}`,
          }
        : null,
      auxiliar: auxiliar_usuario
        ? {
            user_uuid: auxiliar_inscripcion.user_uuid,
            nombre: auxiliar_usuario.nombre,
            apellido: auxiliar_usuario.apellido,
            nombre_completo: `${auxiliar_usuario.nombre} ${auxiliar_usuario.apellido}`,
          }
        : null,
    };

    // 5. Retornar curso con docentes enriquecidos
    return {
      ...curso,
      docentes_enriquecidos,
    };
  } catch (error) {
    console.error("Error al obtener curso con docentes:", error);
    throw error;
  }
};
