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

export default function BusquedaMateria(second) {

    const [name, setName] = useState("");
    const [found, setFound] = useState(false);
    const [value, setValue] = useState("");

    const handleBaja=()=>{ 
        setFound(false);
        setName("");
        setValue("");
    }
 
    const handleSearch= async()=>{
        if(!value.trim()) return;
        try{
            const response= await materiaPorId(value)
            console.log("Materia encontrado")
            setFound(true)
        }catch(err){
            console.error(`Error al buscar materia: ${value}: ${err.message}`)
            setError(err.message)
            setFound(false)
        }
    }

    return(

        <div className="flex min-h-screen flex-col items-center justify-start bg-gray-50 my-4">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
            <h1>Buscar Usuario</h1>
            <h3 className="text-sm mb-2">
                Indique rol
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
            <h3 className="text-sm mb-2">
                Buscar por nombre y apellido
            </h3>
            <Input
                className="mb-4"
                placeholder="Ingrese nombre y/o apellido"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            <h3 className="text-sm mb-2">
                Buscar por legajo
            </h3>
            <Input
                className="mb-4"
                placeholder="Ingrese legajo"
                value={value}
                number
                onChange={(e) => setValue(e.target.value)}
                />
            <Button
                disabled={!value.trim()}
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
                Buscar
            </Button>
            </div>
            {found ? (
                <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md ml-6 my-4">
                <h3 className="text-sm mb-2">
                    Usuario: lmartinezp
                </h3>
                <h3 className="text-sm mb-2">
                    Correo electronico: lmartinezp@uade.edu.ar
                </h3>
                <Button
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={handleBaja}
                >Volver
                </Button>
                </div>
            ):
            (<div>
                <p className="text-sm text-gray-500 mt-4">No se han encontrado resultados</p>  {/* desp lo cprrijo*/ }
            </div>)}
            
        </div>
    )
}