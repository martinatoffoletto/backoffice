import { usuarioPorId } from "@/api/usuariosApi";
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
import { useState } from "react"
import PopUp from "./PopUp";

export default function BusquedaUsuario(second) {

    const [name, setName] = useState("");
    const [found, setFound] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError]=useState(null)

 
    const handleSearch=async()=>{
       try{
        const response= await usuarioPorId(parseInt(value))
        console.log("Usuario encontrado")
        setFound(true)
       }catch(err){
        console.error(`Error al buscar usuario: ${value}: ${err.message}`)
        setError(err.message)
        setFound(false)
       }
    }
    return(
        <div>

        
            <div className="flex min-h-screen items-start justify-cente my-4">
                <div className="w-full max-w-md p-6 ">
                <h1 className="font-bold text-xl mb-4">Buscar Usuario</h1>
                <span className="block w-full h-[3px] bg-sky-950"></span>

                <div className="flex flex-row items-center justify-between my-4 gap-2">
                    <h3 className="text-sm mb-2 mt-4 shrink-0">
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

                </div>
                <div className="flex flex-row items-center justify-between my-4 gap-2">
                    <h3 className="text-sm mb-2 shrink-0">
                        Buscar por nombre y apellido
                    </h3>
                    <Input
                        
                        placeholder="Ingrese nombre y/o apellido"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-row items-center justify-between my-4 gap-2">   
                    <h3 className="text-sm my-2 mr-2 shrink-0">
                        Buscar por legajo
                    </h3>
                    <Input
                        
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
                {found && (
                    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md ml-6">
                    <h3 className="text-sm mb-2">
                        Usuario: lmartinezp
                    </h3>
                    <h3 className="text-sm mb-2">
                        Correo electronico: lmartinezp@uade.edu.ar
                    </h3>
                    <Button
                        variant="destructive"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={()=>setFound(false)}
                    >Volver
                    </Button>
                    </div>
                )}
            </div>
            {
                error!==null &&(
                    <PopUp title={"Error"} message={error} onClose={()=>setError(null)}/>
                )
            }
        </div>
        
    )
}