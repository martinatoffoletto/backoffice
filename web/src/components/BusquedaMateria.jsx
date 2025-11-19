import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator
} from "@/components/ui/select.jsx";
import { ca } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react"
import CardMateria from "./CardMateria";
import PopUp from "./PopUp";
import { materiaPorId, materiaPorNombre, obtenerMaterias, obtenerCarrerasPorMateria } from "@/api/materiasApi";

export default function BusquedaMateria() {

    const [name, setName] = useState("");
    const [found, setFound] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError]=useState(null)
    const [materiaData, setMateriaData] = useState(null);
    const [loading_state, setLoadingState] = useState(false);
    const [resultados_state, setResultadosState]=useState([])
    const [materiaSeleccionada, setMateriaSeleccionada]=useState(null);
    const [showOpciones, setShowOpciones]=useState(false);

    const handleBaja=()=>{ 
        setFound(false);
        setName("");
        setValue("");
        setMateriaData(null);
    }
 
    const handleSearch= async()=>{
        setLoadingState(true);
        const id = value.trim();
        const nombre = name.trim();
        if (!id && !nombre) return;;
        try {
                let response = null;

            if (id) {
            response = await materiaPorId(id);
            } else {
            response = await materiaPorNombre(nombre);
            }

            if (response) {
            setMateriaData(response);
            setFound(true);
            setLoadingState(false);
            } else{
                setFound(false);
                setMateriaData(null);
                setLoadingState(false);
                
            }
        } catch (err) {
            setLoadingState(false);
            setError(err.message || "Error al buscar la materia");
            setFound(false);
            setMateriaData(null);
        }
}

const handleMateriaClick=(materia)=>{
    setMateriaSeleccionada(materia);
    setShowOpciones(true);
}

const handleCerrarOpciones=()=>{
    setShowOpciones(false);
    setMateriaSeleccionada(null);
}
        // NO BORRAR
        // try{
        //     const response= await materiaPorId(value)
        //     console.log("Materia encontrado")
        //     setFound(true)
        // }catch(err){
        //     console.error(`Error al buscar materia: ${value}: ${err.message}`)
        //     setError(err.message)
        //     setFound(false)
        // }

        useEffect(()=>{
            const allMaterias=async()=>{
                try{
                    const materias= await obtenerMaterias();
                    

                    const materiasConCarreras = await Promise.all(
                        materias.map(async (m) => {
                            const carreras = await obtenerCarrerasPorMateria(m.id_materia);
                            return { ...m, carreras };
                        })
                    );

                    console.log("Materias obtenidas:", materiasConCarreras)
                    setResultadosState(materiasConCarreras)
                }catch(err){
                    console.error("Error al obtener materias", err)
                    setError(err.message || "Error al obtener materias")
                }
            }
            allMaterias()
        },[])

    return(

        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-2xl p-6">
            <h1 className="font-bold text-center text-2xl mb-4">Buscar Materia</h1>
            <span className="block w-full h-[3px] bg-sky-950"></span>

            {/*<div className="flex flex-row items-center justify-between my-4 gap-2">
                <h3 className="text-sm mb-2 shrink-0">
                    Buscar por carrera
                </h3>
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>

                    <SelectContent>            
                        <SelectGroup>
                        <SelectLabel>Opciones</SelectLabel>
                        <SelectItem value="alumno">Alumno</SelectItem>
                        <SelectItem value="docente">Docente</SelectItem>          

                        </SelectGroup>
                    </SelectContent>            
                </Select>
            </div>*/}
            
            <div className="flex flex-col items-center lg:flex-row lg:items-center justify-between my-4 gap-4">
                <h3 className="text-sm mb-2 shrink-0">
                    Buscar por nombre
                </h3>
                <Input
                    className="mb-4 flex-1 w-full"
                    type="text"
                    placeholder="Ingrese nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
            </div>
            
            <div className="flex flex-col items-center lg:flex-row lg:items-center justify-between my-4 gap-4">
                <h3 className="text-sm mb-2 shrink-0">
                    Buscar por identificador
                </h3>
                <Input
                    className="mb-4 flex-1 w-full"
                    type="text"
                    placeholder="Ingrese identificador"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    />
            </div>
            
            <div className="flex justify-center">
            <Button
                disabled={loading_state}
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
               {loading_state ? "Buscando..." : "Buscar"}
            </Button>
            </div>
            </div>
            {!loading_state && resultados_state.length > 0 && (
                <div className="overflow-x-auto mt-8">
                    <Table className="min-w-full border border-gray-200">
                        <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Materia</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Carreras</TableHead>

                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {Array.isArray(resultados_state) && resultados_state.map((materia) => (
                            <TableRow 
                            key={materia.id_materia || Math.random()}
                            className="cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleMateriaClick(materia)}
                            >
                            <TableCell>{materia.id_materia || "-"}</TableCell>
                            <TableCell>
                                {materia.nombre || "-"}
                            </TableCell>
                            <TableCell className={materia.status==="activo" ? "text-green-600" : "text-red-600"}>{materia.status || "-"}</TableCell>
                            <TableCell>
                                {materia.carreras && materia.carreras.length > 0
                                ? materia.carreras.map(c => c.nombre).join(", ")
                                : "-"}
                            </TableCell>

                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            {/* Popup de opciones para curso seleccionado */}
            {showOpciones && materiaSeleccionada && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-blue-500 w-96 max-w-md">
                    <h2 className="text-xl font-bold mb-4 text-blue-600">
                    Opciones para la materia
                    </h2>
                    <p className="mb-4 text-gray-700">
                    <span className="font-semibold">Materia:</span>{" "}
                    {materiaSeleccionada.nombre }
                    </p>
                    <p className="mb-4 text-gray-700">
                    <span className="font-semibold">ID:</span>{" "}
                    {materiaSeleccionada.id_materia }
                    </p>
                    <div className="flex flex-col gap-3 mb-4">
                    <Button
                        onClick={()=>{/*logica para editar materia*/}}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Editar Materia
                    </Button>
                    <Button
                        onClick={()=>{/*logica para editar materia*/}}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Añadir a Carrera
                    </Button>
                    </div>
                    <Button
                    onClick={handleCerrarOpciones}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full"
                    >
                    Cancelar
                    </Button>
                </div>
                </div>
            )}
            {found ? (
                <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 bg-white">
                <CardMateria title={"Materia encontrada"} materia={materiaData} onClose={()=>{setFound(false); setName(""); setValue("")}}></CardMateria>
                <Button
                        onClick={() => {setFound(false); setValue("")}}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-md"
                        >
                        OK
                    </Button>
                </div>
            ):
            (!found && value && (
                <div className="w-full max-w-2xl p-6">
                    <p className="text-sm text-gray-500 mt-4 text-center">No se han encontrado resultados</p>
                </div>
            ))}
            {error !== null && (
                <PopUp title={"Error"} message={error} onClose={()=>setError(null)}/>
            )}
            
        </div>
    )
}