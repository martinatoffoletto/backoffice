export default function NavBar(second) {
    return(
        <div className="w-full h-32 bg-gray-800 text-white flex items-center justify-around px-4">
            <div className="flex flex-col items-center mr-4">

                <img src="/uade.png" alt="Logo" className="h-12 w-32 mr-4 mb-2"/>
                <div className="mr-4 h-8 bg-blue-400 text-white flex flex-col items-center justify-center px-2 rounded">
                    <p className="text-700-sm">Campus Connect</p>
                </div>
            </div>
            <div className="flex-grow flex flex-col justify-center items-center">   
                <h1 className="text-lg font-bold m-4">Portal Administrativo</h1>
                <div className="flex justify-between"> 
                    <a href="/" className="text-sm text-gray-300 hover:text-white mr-4">Inicio</a>
                    <a href="/usuarios" className="text-sm text-gray-300 hover:text-white mr-4">Gestión de Usuarios</a>
                    <a href="/precios" className="text-sm text-gray-300 hover:text-white mr-4">Listado de Precios</a>
                    <a href="/cursos" className="text-sm text-gray-300 hover:text-white mr-4">Gestión de Cursos</a>
                    <a href="/sedes" className="text-sm text-gray-300 hover:text-white mr-4">Sedes</a>
                </div>
            </div>
           <div className="flex flex-col items-center ml-4">
            <img></img>
            <p>nombre de usuario</p>
           </div>
        </div>
    )
}