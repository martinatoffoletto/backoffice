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

export default coreApiInstance;
