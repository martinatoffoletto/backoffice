import docentesApiInstance from "./docentesApiInstance";
import { obtenerUsuarioPorId } from "./usuariosApi";
import { materiaPorId } from "./materiasApi";
import { carreraPorId } from "./carrerasApi";
import { buscarSedes } from "./sedesApi";

/**
 * ALTA CURSOS
 * Obtiene la lista de docentes disponibles para una materia y día específicos
 * @param {string} uuid_materia - UUID de la materia
 * @param {string} dia - Día de la semana (LUNES, MARTES, MIERCOLES, JUEVES, VIERNES)
 * @returns {Promise<Array>} Lista de docentes disponibles con uuid, nombre, apellido y estado
 */
export const obtenerDocentesDisponibles = async ({
  subjectId,
  dayOfWeek,
  modality,
  shift,
  campuses,
}) => {
  try {
    const params = { subjectId };

    if (dayOfWeek) params.dayOfWeek = dayOfWeek.toUpperCase();
    if (modality) params.modality = modality.toUpperCase();
    if (shift) params.shift = shift.toUpperCase();
    if (campuses) {
      params.campuses = await buscarSedes("nombre", campuses, 0, 100) 
      params.campuses = campuses.id_sede.toUpperCase();
    }
      

    console.log("Parámetros para obtener docentes disponibles:", params);

    const response = await docentesApiInstance.get(
      "/admin/teachers/available",
      { params }
    );

    const fullResponse = await Promise.all(
      response.data.map(async (docente) => {
        const usuario = await obtenerUsuarioPorId(docente.teacherId);
        return {
          ...docente,
          nombre: usuario?.nombre || "Nombre no disponible",
          apellido: usuario?.apellido || "Apellido no disponible",
        };
      })
    );

    console.log(`Docentes obtenidos para ${subjectId}:`, fullResponse);
    return fullResponse;
  } catch (error) {
    console.error("Error obteniendo docentes disponibles:", error);
    throw error;
  }
};

/*
 *Asigna la disponibilidad de un docente para todas las materias y días según su configuración
 *@param{string}teacherId - ID del docente
 *@returns{Promise<Object>} Resultado de la operación
 */
export const asignarDisponibilidadDocente = async (teacherId) => {
  try {
    const response = await docentesApiInstance.post(
      `/admin/teachers/availability/${teacherId}/assign`
    );
    console.log(
      `Disponibilidad asignada para docente ${teacherId}: `,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("Error asignando disponibilidad:", error);
    throw error;
  }
};

/**
 * Elimina la disponibilidad de un docente para una materia y día específicos
 * @param {string} uuid_docente - UUID del docente
 * @param {string} uuid_materia - UUID de la materia
 * @param {string} dia - Día de la semana
 * @returns {Promise<Object>} Resultado de la operación
 */
// export const eliminarDisponibilidadDocente = async (
//   uuid_docente,
//   uuid_materia,
//   dia
// ) => {
//   try {
//     const response = await docentesApiInstance.delete(
//       `/teachers/${uuid_docente}/availability`,
//       {
//         params: {
//           subjectId: uuid_materia,
//           day: dia
//         }
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error al eliminar disponibilidad:", error);
//     throw error;
//   }
// };

/**
 * Mapea los datos de propuestas del API al formato esperado por el componente
 * SIN enriquecer (para polling ligero)
 * @param {Array} propuestas - Array de propuestas del API
 * @returns {Array} Array de propuestas mapeadas sin enriquecer
 */
const mapearPropuestasSinEnriquecer = (propuestas) => {
  return propuestas.map((propuesta) => ({
    propuesta_id: propuesta.proposalId,
    uuid_docente: propuesta.teacherId,
    profesor: propuesta.teacherId, // Solo ID
    uuid_materia: propuesta.subjectId,
    materia: propuesta.subjectId, // Solo ID
    uuid_carrera: null, // No se enriquece en polling ligero
    carrera: null, // No se enriquece en polling ligero
    dia: null,
    estado: "pendiente",
    createdAt: propuesta.createdAt,
  }));
};

/**
 * Mapea los datos de propuestas del API al formato esperado por el componente
 * y enriquece con información del usuario (nombre y apellido del profesor), materia y carrera
 * @param {Array} propuestas - Array de propuestas del API
 * @returns {Promise<Array>} Array de propuestas mapeadas y enriquecidas
 */
const mapearPropuestasEnriquecidas = async (propuestas) => {
  const propuestasEnriquecidas = await Promise.all(
    propuestas.map(async (propuesta) => {
      let nombreProfesor = propuesta.teacherId; // Default: mostrar ID
      let nombreMateria = propuesta.subjectId; // Default: mostrar ID
      let nombreCarrera = null; // Default: sin carrera
      let uuidCarrera = null; // Default: sin UUID de carrera

      // Enriquecer profesor y materia en paralelo
      const [usuario, materia] = await Promise.all([
        obtenerUsuarioPorId(propuesta.teacherId).catch((error) => {
          console.warn(
            `No se pudo obtener usuario ${propuesta.teacherId}:`,
            error.message
          );
          return null;
        }),
        materiaPorId(propuesta.subjectId).catch((error) => {
          console.warn(
            `No se pudo obtener materia ${propuesta.subjectId}:`,
            error.message
          );
          return null;
        }),
      ]);

      // Asignar nombres si se encontraron
      if (usuario && usuario.nombre && usuario.apellido) {
        nombreProfesor = `${usuario.nombre} ${usuario.apellido}`;
      }

      // Extraer datos de la materia
      // La respuesta puede venir como { success: true, data: {...} } o directamente {...}
      const materiaData = materia?.data || materia;

      if (materiaData) {
        // El nombre de la materia puede estar en diferentes campos
        nombreMateria =
          materiaData.nombre ||
          materiaData.name_materia ||
          materiaData.name ||
          propuesta.subjectId;

        // La carrera YA VIENE INCLUIDA en la respuesta de materia
        if (materiaData.carrera) {
          uuidCarrera = materiaData.carrera.uuid || materiaData.uuid_carrera;
          nombreCarrera =
            materiaData.carrera.name || materiaData.carrera.nombre || null;

          console.log(
            `✅ Carrera encontrada: ${nombreCarrera} para materia ${nombreMateria}`
          );
        } else if (materiaData.uuid_carrera) {
          // Si no viene el objeto carrera completo, guardar el UUID
          uuidCarrera = materiaData.uuid_carrera;
          console.warn(
            `⚠️ Materia tiene uuid_carrera pero no el objeto carrera completo`
          );
        }
      }

      return {
        propuesta_id: propuesta.proposalId,
        uuid_docente: propuesta.teacherId,
        profesor: nombreProfesor, // Nombre completo o ID como fallback
        uuid_materia: propuesta.subjectId,
        materia: nombreMateria, // Nombre de materia o ID como fallback
        uuid_carrera: uuidCarrera, // UUID de la carrera (puede ser null)
        carrera: nombreCarrera, // Nombre de carrera o null
        dia: null, // El API no proporciona el día
        estado: "pendiente", // Todas las propuestas de este endpoint son pendientes
        createdAt: propuesta.createdAt,
      };
    })
  );

  return propuestasEnriquecidas;
};

/**
 * Obtiene las propuestas pendientes del módulo de docentes SIN enriquecer
 * (ligero, solo para polling y verificar cantidad)
 * @returns {Promise<Array>} Lista de propuestas pendientes sin enriquecer
 */
export const obtenerPropuestasPendientesLigero = async () => {
  try {
    const response = await docentesApiInstance.get("/public/proposals/pending");
    // Mapeo simple sin enriquecimiento (rápido)
    return mapearPropuestasSinEnriquecer(response.data);
  } catch (error) {
    console.error("Error al obtener propuestas pendientes (ligero):", error);
    throw error;
  }
};

/**
 * Obtiene las propuestas pendientes del módulo de docentes
 * usando autenticación JWT (Bearer token) y las enriquece con datos de usuarios y materias
 * @returns {Promise<Array>} Lista de propuestas pendientes mapeadas y enriquecidas
 */
export const obtenerPropuestasPendientes = async () => {
  try {
    // Usar docentesApiInstance que automáticamente incluye el token JWT
    const response = await docentesApiInstance.get("/public/proposals/pending");

    // Mapear y enriquecer los datos con información de usuarios Y materias (async)
    const propuestasEnriquecidas = await mapearPropuestasEnriquecidas(
      response.data
    );

    return propuestasEnriquecidas;
  } catch (error) {
    console.error("Error al obtener propuestas pendientes:", error);
    throw error;
  }
};

/**
 * Actualiza el estado de una propuesta (aprobar o rechazar)
 * @param {string} propuesta_id - UUID de la propuesta a actualizar
 * @param {string} decision - Decision a tomar: "aprobar" o "rechazar"
 * @returns {Promise<Object>} Resultado de la operación
 */
export const actualizarEstadoPropuesta = async (propuesta_id, decision) => {
  try {
    // Validar decisión
    if (!["aprobar", "rechazar"].includes(decision)) {
      throw new Error("Decisión inválida. Debe ser 'aprobar' o 'rechazar'");
    }

    // Mapear decisión a formato del API
    const decision_api = decision === "aprobar" ? "APROBADO" : "RECHAZADO";
    const comment =
      decision === "aprobar" ? "Propuesta aprobada" : "Propuesta rechazada";

    // Hacer PUT con JWT automático
    const response = await docentesApiInstance.put(
      `/teachers/me/proposals/${propuesta_id}`,
      {
        comment: comment,
        decision: decision_api,
      }
    );

    console.log(`✅ Propuesta ${propuesta_id} ${decision_api}`);

    return {
      success: true,
      decision: decision_api,
      data: response.data,
    };
  } catch (error) {
    console.error(`❌ Error al actualizar propuesta ${propuesta_id}:`, error);
    throw error;
  }
};
