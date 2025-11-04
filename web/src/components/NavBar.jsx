import LinkNavBar from "./LinkNavBar"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar.jsx"

export default function NavBar({ menuOpen, setMenuOpen }) {
  return (
    <div
      className={`
        fixed md:static top-0 left-0 z-40
        h-full md:h-auto w-64
        text-white flex flex-col justify-between shadow-md
        transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      style={{ backgroundColor: '#1E3A5F' }}
    >
      <div className="flex flex-col items-center py-6 border-b border-gray-300">
        <img src="/uade.png" alt="Logo" className="w-[150px] mb-2" />
        <div className="text-white px-3 py-1 rounded-md text-sm font-medium"
             style={{ backgroundColor: '#2C7DA0' }}>
          Campus Connect
        </div>
      </div>

      <div className="flex flex-col flex-grow px-4 mt-6 space-y-2">
        <LinkNavBar to="/" title="Inicio" onClick={() => setMenuOpen(false)} />
        <LinkNavBar to="/usuarios" title="Gestión de Usuarios" onClick={() => setMenuOpen(false)} />
        <LinkNavBar to="/carreras" title="Gestión de Carreras" onClick={() => setMenuOpen(false)} />
        <LinkNavBar to="/materias" title="Gestión de Materias" onClick={() => setMenuOpen(false)} />
        <LinkNavBar to="/cursos" title="Gestión de Cursos" onClick={() => setMenuOpen(false)} />
        <LinkNavBar to="/precios" title="Listado de Precios" onClick={() => setMenuOpen(false)} />
        <LinkNavBar to="/sedes" title="Sedes" onClick={() => setMenuOpen(false)} />
        <LinkNavBar to="/TablaAsignaciones" title="Propuestas Docente-Materia" onClick={() => setMenuOpen(false)} />
      </div>

      <div className="flex flex-col items-center py-6 border-t border-gray-300">
        <Avatar>
          <AvatarImage src="/usuario.jpg" alt="Foto de usuario" />
          <AvatarFallback>NU</AvatarFallback>
        </Avatar>
        <p className="text-sm mt-2 font-medium">nombre de usuario</p>
      </div>
    </div>
  )
}
