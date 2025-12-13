import { useState, useEffect } from "react";
import LinkNavBar from "./LinkNavBar";
import { Shield, ArrowLeft } from "lucide-react";

export default function NavBar({ menuOpen, setMenuOpen }) {
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          "https://jtseq9puk0.execute-api.us-east-1.amazonaws.com/api/auth/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.user?.name) {
            setUserName(data.user.name);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div
      className={`
        fixed md:static top-0 left-0 z-40
        h-screen md:h-full w-64
        text-white flex flex-col justify-between shadow-md
        transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      style={{ backgroundColor: "#1E3A5F" }}
    >
      <div className="flex flex-col items-center py-6 border-b border-gray-300">
        <img src="/uade.png" alt="Logo" className="w-[148px] mb-2" />
        <div
          className="text-white px-4 py-1 rounded-md text-sm font-medium"
          style={{ backgroundColor: "#2C7DA0" }}
        >
          Campus Connect
        </div>
      </div>

      <div className="flex flex-col flex-grow px-4 mt-6 space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
        <LinkNavBar to="/" title="Inicio" onClick={() => setMenuOpen(false)} />
        <LinkNavBar
          to="/usuarios"
          title="Gestión de Usuarios"
          onClick={() => setMenuOpen(false)}
        />
        <LinkNavBar
          to="/roles"
          title="Gestión de Roles"
          onClick={() => setMenuOpen(false)}
        />
        <LinkNavBar
          to="/carreras"
          title="Gestión de Carreras"
          onClick={() => setMenuOpen(false)}
        />
        <LinkNavBar
          to="/materias"
          title="Gestión de Materias"
          onClick={() => setMenuOpen(false)}
        />
        <LinkNavBar
          to="/cursos"
          title="Gestión de Cursos"
          onClick={() => setMenuOpen(false)}
        />
        <LinkNavBar
          to="/precios"
          title="Listado de Precios"
          onClick={() => setMenuOpen(false)}
        />
        <LinkNavBar
          to="/sedes"
          title="Gestión de Sedes"
          onClick={() => setMenuOpen(false)}
        />
        <LinkNavBar
          to="/espacios"
          title="Gestión de Espacios"
          onClick={() => setMenuOpen(false)}
        />
        <LinkNavBar
          to="/Asignacion"
          title="Asignación de Docentes"
          onClick={() => setMenuOpen(false)}
        />
      </div>

      <div className="flex flex-col items-center py-6 border-t border-gray-300">
        <Shield size={70} className="text-blue-300" />
        <p className="text-sm mt-2 font-medium text-center">{userName}</p>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href =
              "https://core-frontend-2025-02.netlify.app/home";
          }}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a Home
        </button>
      </div>
    </div>
  );
}
