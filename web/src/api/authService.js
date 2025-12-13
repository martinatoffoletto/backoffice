// URL de Core Login
const CORE_LOGIN_URL = "https://core-frontend-2025-02.netlify.app";

// URL de tu aplicación (para el redirectUrl)
const APP_URL = window.location.origin;

export const redirectToLogin = () => {
  localStorage.removeItem("token");
  if (
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    const redirectUrl = encodeURIComponent(APP_URL);
    window.location.href = `${CORE_LOGIN_URL}/?redirectUrl=${redirectUrl}`;
  } 
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = `${CORE_LOGIN_URL}/home`;
};
