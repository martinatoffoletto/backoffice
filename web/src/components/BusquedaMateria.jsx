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
import { useState } from "react"
import CardMateria from "./CardMateria";
import PopUp from "./PopUp";
import { materiaPorId } from "@/api/materiasApi";

export default function BusquedaMateria(second) {

    const [name, setName] = useState("");
    const [found, setFound] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError]=useState(null)
    const [materiaData, setMateriaData] = useState(null);

    const handleBaja=()=>{ 
        setFound(false);
        setName("");
        setValue("");
        setMateriaData(null);
    }
 
    const handleSearch= async()=>{
        if(!value.trim()) return;
        try {
                const response = await materiaPorId(value); 
                if (response) {
                    setMateriaData(response); 
                    setFound(true);           
                } else {
                    setFound(false);          
                    setMateriaData(null);
                }
            } catch (err) {
                setError(err.message || "Error al buscar la carrera");
                setFound(false);
                setMateriaData(null);
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
    }

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
                disabled={!value.trim()}
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Buscar
            </Button>
            </div>
            </div>
            {found ? (
                <div className="w-full max-w-2xl p-6">
                <CardMateria title={"Materia encontrada"} materia={materiaData} onClose={()=>{setFound(false); setName(""); setValue("")}}></CardMateria>
                
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