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
    "Content-Type": "application/json",
  },
});

docentesApiInstance.interceptors.request.use((config) => {
  // Por ahora no agregamos nada, igual que Core
  return config;
});

docentesApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Manejo de errores similar a Core
    return Promise.reject(error);
  }
);

export default docentesApiInstance;

