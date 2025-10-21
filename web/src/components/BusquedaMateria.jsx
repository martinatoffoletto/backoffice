import { materiaPorId } from "@/api/materiasApi";
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
import CardUsuario from "./CardUsuario";
import PopUp from "./PopUp";

export default function BusquedaMateria(second) {

    const [name, setName] = useState("");
    const [found, setFound] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError]=useState(null)

    const handleBaja=()=>{ 
        setFound(false);
        setName("");
        setValue("");
    }
 
    const handleSearch= async()=>{
        if(!value.trim()) return;
        
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

        <div className="flex min-h-screen flex-col items-center justify-start my-4">
            <div className="w-full max-w-md  p-6 r">
            <h1 className="font-bold text-xl mb-4">Buscar Usuario</h1>
            <span className="block w-full h-[3px] bg-sky-950"></span>

            <div className="flex flex-row items-center justify-between my-4 gap-2">
                <h3 className="text-sm mb-2 shrink-0">
                    Indique carrera
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
            </div>
            
            <div className="flex flex-row items-center justify-between my-4 gap-2">
                <h3 className="text-sm mb-2 shrink-0">
                    Buscar por nombre
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
            </div>
            
            <div className="flex flex-row items-center justify-between my-4 gap-2">
                <h3 className="text-sm mb-2 shrink-0">
                    Buscar por legajo
                </h3>
                <Input
                    className="mb-4"
                    placeholder="Ingrese legajo"
                    value={value}
                    number
                    onChange={(e) => setValue(e.target.value)}
                    />
            </div>
            
            <Button
                disabled={!value.trim()}
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
                Buscar
            </Button>
            </div>
            {found ? (
                <div className="w-full max-w-md  p-6 ml-6 my-4">
                <CardUsuario title={"Materia encontrado"} onClose={()=>{setFound(false); setName(""); setValue("")}}></CardUsuario>
                
                </div>
            ):
            (<div>
                <p className="text-sm text-gray-500 mt-4">No se han encontrado resultados</p>  {/* desp lo cprrijo*/ }
            </div>)}
            {error !== null && (
                <PopUp title={"Error"} message={error} onClose={()=>setError(null)}/>
            )}
            
        </div>
    )
}