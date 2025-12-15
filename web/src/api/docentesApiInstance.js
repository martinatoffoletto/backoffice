import axios from "axios";

const DOCENTES_API_BASE_URL =
  import.meta.env.VITE_DOCENTES_API_URL ||
  "https://modulodocentefinal-production.up.railway.app";

const docentesApiInstance = axios.create({
  baseURL: DOCENTES_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT en cada request
docentesApiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
docentesApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Error de autenticación con módulo de docentes (401)");
      // Opcionalmente redirigir al login si es necesario
      // redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default docentesApiInstance;

