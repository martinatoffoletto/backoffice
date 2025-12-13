import axios from "axios";

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

    if (error.response?.status === 401) {
      window.localStorage.removeItem("token");
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      )
        return;
      window.location.href =
        "https://core-frontend-2025-02.netlify.app/?redirectUrl=" +
        encodeURIComponent(window.location.origin);
      return;
    }

    return Promise.reject(error);
  }
);

export default coreApiInstance;
