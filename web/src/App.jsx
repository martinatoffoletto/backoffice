import { BrowserRouter, Routes, Route } from "react-router-dom"

import NavBar from "./components/NavBar"
import Inicio from "./screens/Inicio"
import Precios from "./screens/Precios"
import Usuarios from "./screens/Usuarios"
import Cursos from "./screens/Cursos"
import Sedes from "./screens/Sedes"
import Sede from "./screens/Sede"
import Materias from "./screens/Materias"

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        {/* Sidebar */}
        <NavBar />

        {/* Contenido principal */}
        <main className="flex-grow bg-white overflow-auto p-8">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/precios" element={<Precios />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/sedes" element={<Sedes />} />
            <Route path="/sede" element={<Sede />} />
            <Route path="/materias" element={<Materias />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
