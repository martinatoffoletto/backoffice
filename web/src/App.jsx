import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import NavBar from "./components/NavBar";
import Inicio from "./screens/Inicio";
import Precios from "./screens/Precios";
import Usuarios from "./screens/Usuarios";
import Roles from "./screens/Roles";
import Cursos from "./screens/Cursos";
import Sedes from "./screens/Sedes";
import Sede from "./screens/Sede";
import Materias from "./screens/Materias";
import Asignacion from "./screens/Asignacion";
import Carreras from "./screens/Carreras";
import Cronograma from "./screens/Cronograma";
import Espacios from "./screens/Espacios";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jwt = params.get("JWT");

    if (jwt) {
      localStorage.setItem("token", jwt);
      console.log("✅ Token obtenido de Core (desde URL)");
    } else if (!localStorage.getItem("token")) {
      loginAutomatico(); // Obtener token automáticamente en testing (sin pasar por Core) hay q borrar
    }
  }, []);

const loginAutomatico = async () => { //TODO: ESTO HAY QUE BORRARLO DESPUES 
    try {
      console.log(
        "🔄 Intentando obtener token desde Core API (modo testing local)..."
      );
      const response = await axios.post(
        "https://jtseq9puk0.execute-api.us-east-1.amazonaws.com/api/auth/login",
        {
          email: "aadmin@campusconnect.edu.ar",
          password: "hola12345",
        }
      );

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        console.log("✅ Token obtenido automáticamente desde Core API");
        console.log("📋 Token:", response.data.access_token);
      }
    } catch (error) {
      console.error("❌ Error al obtener token automáticamente:", error);
    }
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col md:flex-row">
        <NavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <main className="flex-grow bg-gray-50 overflow-auto p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/precios" element={<Precios />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/sede" element={<Sede />} />
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
