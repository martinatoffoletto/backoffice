import axios from "axios";

const CORE_API_URL =
  "https://jtseq9puk0.execute-api.us-east-1.amazonaws.com/api";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const refreshAccessToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(`${CORE_API_URL}/auth/refresh`, {
      refreshToken,
    });

    const { access_token, refresh_token } = response.data;

    localStorage.setItem("token", access_token);
    if (refresh_token) {
      localStorage.setItem("refreshToken", refresh_token);
    }

    isRefreshing = false;
    processQueue(null, access_token);

    return access_token;
  } catch (error) {
    isRefreshing = false;
    processQueue(error, null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "https://core-frontend-2025-02.netlify.app/";

    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.href = "https://core-frontend-2025-02.netlify.app/";
};