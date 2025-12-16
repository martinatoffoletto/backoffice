import axiosInstance from "./axiosInstance";
import docentesApiInstance from "./docentesApiInstance";
import { obtenerUsuarioPorId } from "./usuariosApi";
import { materiaPorId } from "./materiasApi";
import { carreraPorId } from "./carrerasApi";

// Mock data de docentes disponibles
const mockDocentesDisponibles = {
  // uuid_materia -> dia -> lista de docentes
  "4e581607-2aab-4db0-9874-214f039866d6": {
    LUNES: [
      {
        uuid: "e9d03ceb-564c-4c95-b6a8-7e851d40994b",
        nombre: "Juan",
        apellido: "Pérez",
        estado: "pendiente",
      },
      {
        uuid: "a1b2c3d4-564c-4c95-b6a8-111111111111",
        nombre: "María",
        apellido: "García",
        estado: "pendiente",
      },
    ],
    MARTES: [
      {
        uuid: "e9d03ceb-564c-4c95-b6a8-7e851d40114b",
        nombre: "Carlos",
        apellido: "López",
        estado: "pendiente",
      },
      {
        uuid: "b2c3d4e5-564c-4c95-b6a8-222222222222",
        nombre: "Ana",
        apellido: "Rodríguez",
        estado: "pendiente",
      },
    ],
    MIERCOLES: [
      {
        uuid: "e9d03ceb-564c-4c95-b6a8-7e851d40994b",
        nombre: "Juan",
        apellido: "Pérez",
        estado: "pendiente",
      },
      {
        uuid: "b2c3d4e5-564c-4c95-b6a8-222222222222",
        nombre: "Ana",
        apellido: "Rodríguez",
        estado: "pendiente",
      },
    ],
    JUEVES: [
      {
        uuid: "a1b2c3d4-564c-4c95-b6a8-111111111111",
        nombre: "María",
        apellido: "García",
        estado: "pendiente",
      },
      {
        uuid: "e9d03ceb-564c-4c95-b6a8-7e851d40114b",
        nombre: "Carlos",
        apellido: "López",
        estado: "pendiente",
      },
    ],
    VIERNES: [
      {
        uuid: "e9d03ceb-564c-4c95-b6a8-7e851d40994b",
        nombre: "Juan",
        apellido: "Pérez",
        estado: "pendiente",
      },
      {
        uuid: "a1b2c3d4-564c-4c95-b6a8-111111111111",
        nombre: "María",
        apellido: "García",
        estado: "pendiente",
      },
      {
        uuid: "e9d03ceb-564c-4c95-b6a8-7e851d40114b",
        nombre: "Carlos",
        apellido: "López",
        estado: "pendiente",
      },
    ],
  },
  // Materia por defecto para cualquier otra materia
  default: {
    LUNES: [
      {
        uuid: "e9d03ceb-564c-4c95-b6a8-7e851d40994b",
        nombre: "Juan",
        apellido: "Pérez",
        estado: "pendiente",
      },
      {
        uuid: "a1b2c3d4-564c-4c95-b6a8-111111111111",
        nombre: "María",
        apellido: "García",
        estado: "pendiente",
      },
    ],
    MARTES: [
      {
        uuid: "e9d03ceb-564c-4c95-b6a8-7e851d40114b",
        nombre: "Carlos",
        apellido: "López",
        estado: "pendiente",
      },
      {
        uuid: "b2c3d4e5-564c-4c95-b6a8-222222222222",
        nombre: "Ana",
        apellido: "Rodríguez",
        estado: "pendiente",
      },
    ],
    MIERCOLES: [
      {
        uuid: "e9d03ceb-564c-4c95-b6a8-7e851d40994b",
        nombre: "Juan",
        apellido: "Pérez",
        estado: "pendiente",
      },
    ],
    JUEVES: [
      {
        uuid: "a1b2c3d4-564c-4c95-b6a8-111111111111",
        nombre: "María",
        apellido: "García",
        estado: "pendiente",
      },
    ],
    VIERNES: [
      {
        uuid: "b2c3d4e5-564c-4c95-b6a8-222222222222",
        nombre: "Ana",
        apellido: "Rodríguez",
        estado: "pendiente",
      },
    ],
  },
};

/**
 * Obtiene la lista de docentes disponibles para una materia y día específicos
 * @param {string} uuid_materia - UUID de la materia
 * @param {string} dia - Día de la semana (LUNES, MARTES, MIERCOLES, JUEVES, VIERNES)
 * @returns {Promise<Array>} Lista de docentes disponibles con uuid, nombre, apellido y estado
 */
export const obtenerDisponibilidadDocentes = async (uuid_materia, dia) => {
  try {
    // TODO: Descomentar cuando el endpoint esté disponible
    // const response = await docentesApiInstance.get("/docentes/disponibilidad", {
    //   params: { uuid_materia, dia },
    // });
    // return response.data;

    // Mock response
    console.log(
      `[MOCK] Obteniendo disponibilidad docentes - Materia: ${uuid_materia}, Día: ${dia}`
    );

    const materiaData =
      mockDocentesDisponibles[uuid_materia] || mockDocentesDisponibles.default;
    const diaUpper = dia?.toUpperCase() || "LUNES";
    const docentes = materiaData[diaUpper] || [];

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));

    return docentes;
  } catch (error) {
    console.error("Error al obtener disponibilidad de docentes:", error);
    throw error;
  }
};

/**
 * Actualiza el estado de disponibilidad de un docente (aceptado/rechazado)
 * @param {string} uuid_docente - UUID del docente
 * @param {string} uuid_materia - UUID de la materia
 * @param {string} dia - Día de la semana
 * @param {string} estado - Nuevo estado ("aceptado" o "rechazado")
 * @returns {Promise<Object>} Resultado de la operación
 */
export const actualizarEstadoDisponibilidad = async (
  uuid_docente,
  uuid_materia,
  dia,
  estado
) => {
  try {
    // Validar estado
    if (!["aceptado", "rechazado"].includes(estado)) {
      throw new Error("Estado inválido. Debe ser 'aceptado' o 'rechazado'");
    }

    // TODO: Descomentar cuando el endpoint esté disponible
    // const response = await docentesApiInstance.patch(`/docentes/disponibilidad/${uuid_docente}`, {
    //   uuid_materia,
    //   dia,
    //   estado,
    // });
    // return response.data;

    // Mock response
    console.log(
      `[MOCK] Actualizando estado disponibilidad - Docente: ${uuid_docente}, Estado: ${estado}`
    );

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      success: true,
      message: `Estado actualizado a '${estado}' correctamente`,
      data: {
        uuid_docente,
        uuid_materia,
        dia,
        estado,
      },
    };
  } catch (error) {
    console.error("Error al actualizar estado de disponibilidad:", error);
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
export const eliminarDisponibilidadDocente = async (
  uuid_docente,
  uuid_materia,
  dia
) => {
  try {
    // TODO: Descomentar cuando el endpoint esté disponible
    // const response = await docentesApiInstance.delete(`/docentes/disponibilidad/${uuid_docente}`, {
    //   params: { uuid_materia, dia },
    // });
    // return response.data;

    // Mock response
    console.log(
      `[MOCK] Eliminando disponibilidad - Docente: ${uuid_docente}, Materia: ${uuid_materia}, Día: ${dia}`
    );

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      success: true,
      message: "Disponibilidad eliminada correctamente",
      data: {
        uuid_docente,
        uuid_materia,
        dia,
      },
    };
  } catch (error) {
    console.error("Error al eliminar disponibilidad del docente:", error);
    throw error;
  }
};

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
          console.warn(`No se pudo obtener usuario ${propuesta.teacherId}:`, error.message);
          return null;
        }),
        materiaPorId(propuesta.subjectId).catch((error) => {
          console.warn(`No se pudo obtener materia ${propuesta.subjectId}:`, error.message);
          return null;
        })
      ]);
      
      // Asignar nombres si se encontraron
      if (usuario && usuario.nombre && usuario.apellido) {
        nombreProfesor = `${usuario.nombre} ${usuario.apellido}`;
      }
      
      // Extraer datos de la materia
      if (materia) {
        // El nombre de la materia puede estar en diferentes campos
        nombreMateria = materia.nombre || materia.name_materia || materia.name || propuesta.subjectId;
        
        // La carrera YA VIENE INCLUIDA en la respuesta de materia
        if (materia.carrera) {
          uuidCarrera = materia.carrera.uuid || materia.uuid_carrera;
          nombreCarrera = materia.carrera.name || materia.carrera.nombre || null;
          
          console.log(`✅ Carrera encontrada: ${nombreCarrera}`);
        } else if (materia.uuid_carrera) {
          // Si no viene el objeto carrera completo, guardar el UUID
          uuidCarrera = materia.uuid_carrera;
          console.warn(`⚠️ Materia tiene uuid_carrera pero no el objeto carrera completo`);
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
    const propuestasEnriquecidas = await mapearPropuestasEnriquecidas(response.data);
    
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
    const comment = decision === "aprobar" 
      ? "Propuesta aprobada" 
      : "Propuesta rechazada";
    
    // Hacer PUT con JWT automático
    const response = await docentesApiInstance.put(
      `/teachers/me/proposals/${propuesta_id}`,
      {
        comment: comment,
        decision: decision_api
      }
    );
    
    console.log(`✅ Propuesta ${propuesta_id} ${decision_api}`);
    
    return {
      success: true,
      decision: decision_api,
      data: response.data
    };
  } catch (error) {
    console.error(`❌ Error al actualizar propuesta ${propuesta_id}:`, error);
    throw error;
  }
};
