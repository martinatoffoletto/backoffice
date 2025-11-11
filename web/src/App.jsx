import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"

import NavBar from "./components/NavBar"
import Inicio from "./screens/Inicio"
import Precios from "./screens/Precios"
import Usuarios from "./screens/Usuarios"
import Cursos from "./screens/Cursos"
import Sedes from "./screens/Sedes"
import Sede from "./screens/Sede"
import Materias from "./screens/Materias"
import Espacios from "./screens/Espacios"
import Roles from "./screens/Roles"
import Parametros from "./screens/Parametros"

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="flex h-screen flex-col md:flex-row">
        {/* Navbar */}
        <NavBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* Contenido principal */}
        <main className="flex-grow bg-gray-50 overflow-auto p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/precios" element={<Precios />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/sedes" element={<Sedes />} />
            <Route path="/sede" element={<Sede />} />
            <Route path="/materias" element={<Materias />} />
            <Route path="/espacios" element={<Espacios />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/parametros" element={<Parametros />} />
          </Routes>
        </main>

        {/* Botón hamburguesa (solo visible en móvil) */}
        <button
          className="fixed top-4 left-4 z-50 md:hidden bg-sky-900 text-white p-2 rounded-lg shadow-md"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>
    </BrowserRouter>
  )
}

export default App
