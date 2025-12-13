import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import NavBar from "./components/NavBar";
import Inicio from "./screens/Inicio";
import Precios from "./screens/Precios";
import Usuarios from "./screens/Usuarios";
import Roles from "./screens/Roles";
import Cursos from "./screens/Cursos";
import Sedes from "./screens/Sedes";
import Materias from "./screens/Materias";
import Asignacion from "./screens/Asignacion";
import Carreras from "./screens/Carreras";
import Cronograma from "./screens/Cronograma";
import Espacios from "./screens/Espacios";
import { redirectToLogin } from "./api/authService";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwt = params.get("JWT");

    if (jwt) {
      localStorage.setItem("token", jwt);
      // Limpiar la URL (quitar ?JWT=...)
      window.history.replaceState({}, document.title, window.location.pathname);
      console.log("✅ Token obtenido de Core");
    } else if (!localStorage.getItem("token")) {
      redirectToLogin();
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="flex h-screen flex-col md:flex-row w-screen">
        <NavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main className="flex-1 w-full min-w-0 bg-gray-50 overflow-auto p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/precios" element={<Precios />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/materias" element={<Materias />} />
            <Route path="/asignacion" element={<Asignacion />} />
            <Route path="/carreras" element={<Carreras />} />
            <Route path="/cronograma" element={<Cronograma />} />
            <Route path="/espacios" element={<Espacios />} />
            <Route path="/sedes" element={<Sedes />} />
          </Routes>
        </main>

        <button
          className="fixed top-4 left-4 z-50 md:hidden bg-sky-900 text-white p-2 rounded-lg shadow-md"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "X" : "="}
        </button>
      </div>
    </BrowserRouter>
  );
}

export default App;
