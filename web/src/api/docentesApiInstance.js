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
    "Content-Type": "application/json",
  },
  // withCredentials: true, // Comentar si causa problemas de CORS
});

// Interceptor para agregar el JSESSIONID hardcodeado temporalmente
// TODO: Cambiar cuando implementen JWT
docentesApiInstance.interceptors.request.use((config) => {
  // JSESSIONID hardcodeado temporalmente
  const jsessionId = "B5A26B61D9D026EF00859600EE52E718";
  if (jsessionId) {
    config.headers.Cookie = `JSESSIONID=${jsessionId}`;
  }
  return config;
});

export default docentesApiInstance;

