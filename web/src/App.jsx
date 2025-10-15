import { Button } from "@/components/ui/button"
import NavBar from "./components/NavBar"
import Inicio from "./screens/Inicio"
import Precios from "./screens/Precios"
import Usuarios from "./screens/Usuarios"
import Cursos from "./screens/Cursos"
import Sedes from "./screens/Sedes"
import Sede from "./screens/Sede"

import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import Materias from "./screens/Materias"


function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/precios" element={<Precios />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/sedes" element={<Sedes />} />
        <Route path="/sede" element={<Sede />} />
        <Route path="/materias" element={<Materias />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App