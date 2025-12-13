import axios from "axios";
import { refreshAccessToken } from "./authService";

const CORE_API_BASE_URL =
  "https://jtseq9puk0.execute-api.us-east-1.amazonaws.com/api";

const coreApiInstance = axios.create({
  baseURL: CORE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

coreApiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

coreApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return coreApiInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default coreApiInstance;
