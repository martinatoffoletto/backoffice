import Link from "./Link";
import {Avatar} from '@/components/ui/avatar.jsx';

export default function NavBar(second) {
    return(
        //OPCION 1
        // <div className="w-full h-32 bg-gray-800 text-white flex items-center justify-around px-4">
        //     <div className="flex flex-col items-center mr-4">

        //         <img src="/uade.png" alt="Logo" className="h-12 w-32 mr-4 mb-2"/>
        //         <div className="mr-4 h-8 bg-sky-900 text-white flex flex-col items-center justify-center px-2 rounded">
        //             <p className="text-700-sm">Campus Connect</p>
        //         </div>
        //     </div>
        //     <div className="flex-grow flex flex-col justify-center items-center">   
        //         <h1 className="text-lg font-bold m-4">Portal Administrativo</h1>
        //         <div className="flex justify-between"> 
        //             <Link to="/" title="Inicio" />
        //             <Link to="/usuarios" title="Gestión de Usuarios" />
        //             <Link to="/cursos" title="Gestión de Cursos" />
        //             <Link to="/materias" title="Gestión de Materias" />
        //             <Link to="/precios" title="Listado de Precios" />
        //             <Link to="/sedes" title="Sedes" />
                    
        //         </div>
        //     </div>
        //    <div className="flex flex-col items-center ml-4">
        //     <Avatar />
        //     <p className="text-sm">nombre de usuario</p>
        //    </div>
        // </div>

        //OPCION 2

        <div className="h-screen w-64 bg-gray-100 text-gray-800 flex flex-col justify-between shadow-md">
            <div className="flex flex-col items-center py-6 border-b border-gray-300">
                <img src="/uade.png" alt="Logo" className="h-12 w-auto mb-2" />
                <div className="bg-sky-900 text-white px-3 py-1 rounded-md text-sm font-medium">
                Campus Connect
                </div>
            </div>

            <div className="flex flex-col flex-grow px-4 mt-6 space-y-2">
                <h1 className="text-lg font-bold mb-4 text-center">Portal Administrativo</h1>
                <Link to="/" title="Inicio" />
                <Link to="/usuarios" title="Gestión de Usuarios" />
                <Link to="/cursos" title="Gestión de Cursos" />
                <Link to="/materias" title="Gestión de Materias" />
                <Link to="/precios" title="Listado de Precios" />
                <Link to="/sedes" title="Sedes" />
            </div>

            <div className="flex flex-col items-center py-6 border-t border-gray-300">
                <Avatar />
                <p className="text-sm mt-2 font-medium">nombre de usuario</p>
            </div>
        </div>
    );
}
