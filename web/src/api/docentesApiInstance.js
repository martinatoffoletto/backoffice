import axios from "axios";

/**
 * Obtener el valor de una cookie por su nombre
 * @param {string} name - Nombre de la cookie
 * @returns {string|null} - Valor de la cookie o null si no existe
 */
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
};

const DOCENTES_API_BASE_URL =
  import.meta.env.VITE_DOCENTES_API_URL ||
  "https://modulodocentefinal-production.up.railway.app";

const docentesApiInstance = axios.create({
  baseURL: DOCENTES_API_BASE_URL,
  headers: {
    "Accept": "application/json",
    // No incluir Content-Type para GET requests
  },
  // No usar withCredentials para endpoints públicos
});

// Interceptor para agregar el JSESSIONID cuando sea necesario
// TODO: Descomentar cuando el endpoint requiera autenticación
docentesApiInstance.interceptors.request.use((config) => {
  // Por ahora no enviamos Cookie ya que el endpoint es público
  // const jsessionId = getCookie("JSESSIONID");
  // if (jsessionId) {
  //   config.headers.Cookie = `JSESSIONID=${jsessionId}`;
  // }
  return config;
});

export default docentesApiInstance;

