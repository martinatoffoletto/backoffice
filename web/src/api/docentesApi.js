import axiosInstance from "./axiosInstance";
import docentesApiInstance from "./docentesApiInstance";

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
 * @param {Array} propuestas - Array de propuestas del API
 * @returns {Array} Array de propuestas mapeadas
 */
const mapearPropuestas = (propuestas) => {
  return propuestas.map((propuesta) => ({
    propuesta_id: propuesta.proposalId,
    uuid_docente: propuesta.teacherId,
    profesor: propuesta.teacherId, // TODO: Obtener nombre del profesor cuando esté disponible el endpoint
    uuid_materia: propuesta.subjectId,
    materia: propuesta.subjectName || propuesta.subjectId,
    dia: null, // El API no proporciona el día, se puede agregar cuando esté disponible
    estado: "pendiente", // Todas las propuestas del endpoint son pendientes
    createdAt: propuesta.createdAt,
  }));
};

/**
 * Obtiene las propuestas pendientes del módulo de docentes usando fetch
 * @returns {Promise<Array>} Lista de propuestas pendientes mapeadas al formato del componente
 */
export const obtenerPropuestasPendientes = async () => {
  try {
    const DOCENTES_API_BASE_URL =
      import.meta.env.VITE_DOCENTES_API_URL ||
      "https://modulodocentefinal-production.up.railway.app";
    
    const response = await fetch(
      `${DOCENTES_API_BASE_URL}/public/proposals/pending`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
        // No incluir credentials para evitar problemas
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Mapear los datos del API al formato esperado por el componente
    return mapearPropuestas(data);
  } catch (error) {
    console.error("Error al obtener propuestas pendientes:", error);
    throw error;
  }
};
