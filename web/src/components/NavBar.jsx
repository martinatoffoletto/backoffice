import Link from "./Link"
import { Avatar } from "@/components/ui/avatar.jsx"

export default function NavBar({ menuOpen, setMenuOpen }) {
  return (
    <div
      className={`
        fixed md:static top-0 left-0 z-40
        h-full md:h-auto w-64
        bg-white text-gray-800 flex flex-col justify-between shadow-md
        transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="flex flex-col items-center py-6 border-b border-gray-300">
        <img src="/logo.png" alt="Logo" className="h-12 w-auto mb-2" />
        <div className="bg-sky-900 text-white px-3 py-1 rounded-md text-sm font-medium">
          Campus Connect
        </div>
      </div>

      <div className="flex flex-col flex-grow px-4 mt-6 space-y-2">
        <Link to="/" title="Inicio" onClick={() => setMenuOpen(false)} />
        <Link to="/usuarios" title="Gestión de Usuarios" onClick={() => setMenuOpen(false)} />
        <Link to="/cursos" title="Gestión de Cursos" onClick={() => setMenuOpen(false)} />
        <Link to="/materias" title="Gestión de Materias" onClick={() => setMenuOpen(false)} />
        <Link to="/precios" title="Listado de Precios" onClick={() => setMenuOpen(false)} />
        <Link to="/sedes" title="Sedes" onClick={() => setMenuOpen(false)} />
      </div>

      <div className="flex flex-col items-center py-6 border-t border-gray-300">
        <Avatar />
        <p className="text-sm mt-2 font-medium">nombre de usuario</p>
      </div>
    </div>
  )
}
