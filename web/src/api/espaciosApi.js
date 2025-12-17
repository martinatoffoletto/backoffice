import axiosInstance from "./axiosInstance";
import { obtenerCursos } from "./cursosApi";
import { obtenerSedes } from "./sedesApi";

export const altaEspacio = async (espacioData) => {
  try {
    const response = await axiosInstance.post("/espacios/", espacioData);
    return response.data;
  } catch (error) {
    console.error("Error al crear espacio:", error);
    throw error;
  }
};

export const bajaEspacio = async (id) => {
  try {
    const response = await axiosInstance.delete(`/espacios/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar espacio:", error);
    throw error;
  }
};

export const actualizarEspacio = async (id, espacioData) => {
  try {
    const response = await axiosInstance.patch(`/espacios/${id}`, espacioData);
    return response.data;
  } catch (err) {
    console.error("Error al modificar el espacio:", err);
    throw err;
  }
};

export const modificarEspacio = actualizarEspacio;

export const espacioPorId = async (id) => {
  try {
    const response = await axiosInstance.get(`/espacios/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error al buscar espacio:", err);
    throw err;
  }
};

export const obtenerEspacios = async (
  skip = 0,
  limit = 100,
  status_filter = null
) => {
  try {
    const params = { skip, limit };
    if (status_filter !== null) {
      params.status_filter = status_filter;
    }
    const response = await axiosInstance.get("/espacios/", { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener espacios:", error);
    throw error;
  }
};

export const buscarEspacios = async (param, value, skip = 0, limit = 100) => {
  try {
    const params = { param, value, skip, limit };
    const response = await axiosInstance.get("/espacios/", { params });
    return response.data;
  } catch (error) {
    console.error("Error al buscar espacios:", error);
    throw error;
  }
};

export const aulasDisponibles = async (desde, hasta, dia, sede, turno) => {
  try {
    const aulas = await buscarEspacios("tipo", "AULA", 0, 100);

    const cursosResponse = await obtenerCursos();
    const cursos = cursosResponse.data || cursosResponse;

    const sedesResponse = await obtenerSedes((status_filter = "active"));
    const sedes = sedesResponse.filter((s) => s.status);

    const sedeObj = sedes.find((s) => s.nombre === sede);
    if (!sedeObj) return [];

    const sedeId = sedeObj.id_sede;

    const cursosConflicto = cursos.filter(
      (curso) =>
        curso.sede === sede &&
        curso.dia === dia &&
        curso.turno === turno &&
        curso.estado === "activo" // Solo cursos activos
    );

    const aulasDisponibles = aulas.filter((aula) => {
      if (aula.id_sede !== sedeId) return false;

      const conflicto = cursosConflicto.some((curso) => {
        if (curso.aula !== aula.nombre) return false;

        const cursoDesde = new Date(curso.desde);
        const cursoHasta = new Date(curso.hasta);
        const nuevoDesde = new Date(desde);
        const nuevoHasta = new Date(hasta);

        return !(nuevoHasta <= cursoDesde || nuevoDesde >= cursoHasta);
      });

      return !conflicto;
    });

    return aulasDisponibles;
  } catch (error) {
    console.error("Error al obtener aulas disponibles:", error);
    throw error;
  }
};
