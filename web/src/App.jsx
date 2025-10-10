import { Button } from "@/components/ui/button"
import NavBar from "./components/NavBar"
import Inicio from "./screens/Inicio"
import Precios from "./screens/Precios"
import Usuarios from "./screens/Usuarios"
import Cursos from "./screens/Cursos"
import Sedes from "./screens/Sedes"
import Sede from "./screens/Sede"
import ModifCurso from "./screens/ModifCurso"
import BajaCurso from "./screens/BajaCurso"
import AltaCurso from "./screens/AltaCurso"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import AltaUsuario from "./screens/AltaUsuario"
import BajaUsuario from "./screens/BajaUsuario"
import ModifUsuario from "./screens/ModifUsuario"
import BusquedaUsuario from "./screens/BusquedaUsuario"


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
        <Route path="/modifcurso" element={<ModifCurso />} />
        <Route path="/bajacurso" element={<BajaCurso />} />
        <Route path="/altacurso" element={<AltaCurso />} />
        <Route path="/altausuario" element={<AltaUsuario />} />
        <Route path="/bajausuario" element={<BajaUsuario />} />
        <Route path="/modifusuario" element={<ModifUsuario />} />
        <Route path="/busquedausuario" element={<BusquedaUsuario />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App