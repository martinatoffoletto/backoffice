import Link from "./Link";
import {Avatar} from '@/components/ui/avatar.jsx';

export default function NavBar(second) {
    return(
        <div className="w-full h-32 bg-gray-800 text-white flex items-center justify-around px-4">
            <div className="flex flex-col items-center mr-4">

                <img src="/uade.png" alt="Logo" className="h-12 w-32 mr-4 mb-2"/>
                <div className="mr-4 h-8 bg-sky-900 text-white flex flex-col items-center justify-center px-2 rounded">
                    <p className="text-700-sm">Campus Connect</p>
                </div>
            </div>
            <div className="flex-grow flex flex-col justify-center items-center">   
                <h1 className="text-lg font-bold m-4">Portal Administrativo</h1>
                <div className="flex justify-between"> 
                    <Link to="/inicio" title="Inicio" />
                    <Link to="/usuarios" title="Gestión de Usuarios" />
                    <Link to="/precios" title="Listado de Precios" />
                    <Link to="/cursos" title="Gestión de Cursos" />
                    <Link to="/sedes" title="Sedes" />
                </div>
            </div>
           <div className="flex flex-col items-center ml-4">
            <Avatar />
            <p className="text-sm">nombre de usuario</p>
           </div>
        </div>
    )
}