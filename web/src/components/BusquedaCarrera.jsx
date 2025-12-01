import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState , useEffect} from "react"
import CardCarrera from "./CardCarrera";
import PopUp from "./PopUp";
import { carreraPorId, carreraPorNombre, obtenerCarreras, obtenerMateriasPorCarrera } from "@/api/carrerasApi";
import { obtenerCarrerasPorMateria } from "@/api/materiasApi";
import { TableCell, TableHead, Table, TableBody, TableHeader , TableRow} from "./ui/table";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"


export default function BusquedaCarrera({onCarreraSeleeccionada}) {

    const [name, setName] = useState("");
    const [found, setFound] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError]=useState(null)
    const [carreraData, setCarreraData] = useState(null);
    const [loading_state, setLoadingState]=useState(false);
    const [resultados_state, setResultadosState]=useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;

    const paginatedCarreras = resultados_state.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(resultados_state.length / itemsPerPage);

    const handleBaja=()=>{ 
        setFound(false);
        setName("");
        setValue("");
        setCarreraData(null);
    }

    const handleEditarCarrera=(carrera)=>{
        if(carrera && onCarreraSeleeccionada){
            onCarreraSeleeccionada(carrera, "modificacion")

        }
        

    }

    const handleGestionMaterias=(carrera)=>{
        if(carrera && onCarreraSeleeccionada){
            onCarreraSeleeccionada(carrera, "gestionar")
            
        }
    }
 
    const handleSearch= async()=> {
        const id = value.trim();
        const nombre = name.trim();
        if (!id && !nombre) return;

        try {
            let response = null;
            setShowDropdown(false);
            if (id) {
                response = await carreraPorId(id);
            } else {
                response = await carreraPorNombre(nombre);
            }

            if (response) {
                setCarreraData(response);
                setFound(true);
            } else {
                setFound(false);
                setCarreraData(null);
            }
        } catch (err) {
            setError(err.message || "Error al buscar la carrera");
            setFound(false);
            setCarreraData(null);
        }
    }

    const handleCarreraClick=(carrera)=>{
        setError(null)
        setShowDropdown(false);
        setCarreraData(carrera);
        setFound(true);
    }

    useEffect(()=>{
        setLoadingState(true);
        const allCarreras=async()=>{
            try{
                const carreras=await obtenerCarreras();
                
                const materiasCarerra=await Promise.all(carreras.map(async(carrera)=>{
                    const materias=await obtenerMateriasPorCarrera(carrera.id_carrera);
                    return {...carrera,  materias};
                }))

                console.log(materiasCarerra)
                setLoadingState(false)
                setResultadosState(materiasCarerra)
            }catch(err){
                setError(err.message || "Error al obtener carreras y materias")
                setLoadingState(false)
            }
        }
        allCarreras();
    },[])

    return(

        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-2xl p-6">
            <h1 className="font-bold text-center text-2xl mb-4">Buscar Carrera</h1>
            <span className="block w-full h-[3px] bg-sky-950"></span>

            <div className="flex flex-col items-center lg:flex-row lg:items-center justify-between my-4 gap-4">
                <h3 className="text-sm mb-2 shrink-0">
                    Indique nombre de la carrera
                </h3>
                <div className="relative w-full max-w-2xl">
                    <Input
                        className="mb-4 w-full"
                        type="text"
                        placeholder="Ingrese nombre"
                        value={name}
                        onChange={(e) => {
                        const texto = e.target.value
                        setName(texto)

                        if (texto.trim() === "") {
                            setSuggestions([])
                            setShowDropdown(false)
                            return
                        }

                        const filtradas = resultados_state.filter((carrera) =>
                            carrera.nombre.toLowerCase().includes(texto.toLowerCase())
                        )

                        setSuggestions(filtradas)
                        setShowDropdown(true)
                        }}
                    />

                    {showDropdown && suggestions.length > 0 && (
                        <Command className="absolute left-0 right-0 bg-white border rounded-md shadow-md mt-1 z-50 min-h-fit max-h-60 overflow-y-auto">
                        <CommandGroup heading="Coincidencias">
                            {suggestions.map((carrera) => (
                            <CommandItem
                                key={carrera.id_carrera}
                                onSelect={() => {
                                handleCarreraClick(carrera)
                                setName(carrera.nombre)
                                setShowDropdown(false)
                                }}
                            >
                                {carrera.nombre} —{" "}
                                <span className="text-sm text-gray-500">
                                {carrera.materias.length} materias
                                </span>
                            </CommandItem>
                            ))}
                        </CommandGroup>
                        </Command>
                    )}
                    </div>



            </div>
            
                        
            <div className="flex flex-col items-center lg:flex-row lg:items-center justify-between my-4 gap-4">
                <h3 className="text-sm mb-2 shrink-0">
                    Buscar por identificador de carrera
                </h3>
                <Input
                    className="mb-4 flex-1 w-full"
                    type="text"
                    placeholder="Ingrese el identificador"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    />
            </div>

            {error !== null && (
                <p className="text-red-500 text-sm my-4 text-center">{error}</p>
            )}
            
            <div className="flex justify-center">
                
            <Button
                disabled={!value.trim() && !name.trim()}
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Buscar
            </Button>
            </div>
            
            {!loading_state && resultados_state.length > 0 && (
                <div className="overflow-x-auto mt-8">
                    <Table className="min-w-full border border-gray-200">
                        <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Carrera</TableHead>
                            <TableHead>Nivel</TableHead>
                            <TableHead>Duracion</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Materias</TableHead>

                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {paginatedCarreras.map((carrera) => (
                            <TableRow
                                key={carrera.id_carrera}
                                className="cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleCarreraClick(carrera)}
                            >
                                <TableCell>{carrera.id_carrera}</TableCell>
                                <TableCell>{carrera.nombre}</TableCell>
                                <TableCell>{carrera.nivel}</TableCell>
                                <TableCell>
                                {carrera.duracion_anios ? `${carrera.duracion_anios} años` : "-"}
                                </TableCell>
                                <TableCell
                                className={
                                    carrera.status === "activo"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                                >
                                {carrera.status === "activo" ? "Activo" : "Inactivo"}
                                </TableCell>

                                <TableCell>
                                <div className="flex items-center ">
                                   
                                    <Button
                                    className="ml-2 text-sky-950 hover:border-sky-950 font-semibold py-1 px-4"
                                    variant="outline"
                                    size="xs"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCarreraClick(carrera);
                                    }}
                                    >
                                    Ver {carrera.materias.length} materias
                                    </Button>
                                </div>
                                </TableCell>
                            </TableRow>
                            ))}

                        </TableBody>
                    </Table>

                    {totalPages > 1 ? (
                        <div className="mt-4 flex justify-center">
                            <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                    currentPage > 1 && setCurrentPage(currentPage - 1)
                                    }
                                />
                                </PaginationItem>

                                {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                    isActive={currentPage === i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    >
                                    {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                                ))}

                                <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                                    }
                                />
                                </PaginationItem>
                            </PaginationContent>
                            </Pagination>
                        </div>
                    ):
                    <p className="text-center text-gray-500 text-sm mt-4">{resultados_state.length} resultados encontrados</p>
                    }


                </div>
            )}
            
            </div>
            {found && carreraData ? (
                <div className="flex flex-col justify-center items-center border border-sky-600 p-4 rounded-md shadow-sm gap-4 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <CardCarrera title={"Operaciones a realizar"} carrera={carreraData} onClose={()=>{setFound(false); setName(""); setValue("")}}></CardCarrera>
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => {handleEditarCarrera(carreraData)}}
                            className="bg-gray-50 border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white  font-bold px-6 py-2 rounded-md"
                            >
                            Editar Carrera
                        </Button>
                        <Button
                            onClick={() => {handleGestionMaterias(carreraData)}}
                            className=" bg-gray-50 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold px-6 py-2 rounded-md"
                            >
                            Gestionar Materias
                        </Button>
                        <Button
                            onClick={() => {setFound(false); setValue("")}}
                            className="bg-gray-50 border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white font-bold px-6 py-2 rounded-md"
                            >
                            Cerrar
                        </Button>
                    </div>
                    
                </div>
            ):
            (!found && value && (
                <div className="w-full max-w-2xl p-6">
                    <p className="text-sm text-gray-500 mt-4 text-center">No se han encontrado resultados</p>
                </div>
            ))}
            
            
        </div>
    )
}