import CardUsuario from "@/components/CardUsuario";
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
import PopUp from "@/components/PopUp";
import { useState } from "react";
import { bajaUsuario, usuarioPorId } from "@/api/usuariosApi";

export default function BajaUsuario(second) {
    const [value, setValue] = useState("");
    const [found, setFound] = useState(false);
    const [error, setError] = useState(null);
    const [completed, setCompleted]=useState(false)
    const [user, setUser]= useState(null)
    const [ deleted, setDeleted]=useState(false)

    const handleSearch = async() => {
        try{
            if (!value.trim()) return;
            const response = await usuarioPorId(parseInt(value))//en la version original no hay que parsearlo
            console.log(`Usuario con id: ${value}  encontrado: ${response}`)
            setUser(response)
            setFound(true)
        }catch(error){
            console.log("Error al buscar usuario", error.message)
            setError(error.message)
        }
    };

    const handleBaja=async()=>{
        try{
           const response= await bajaUsuario(value)
           console.log("Usuario dado de baja exitosamente")
           setDeleted(true)
           setFound(false)

        }catch(err){
            console.log("Error al dar de baja usuario:", err.message)
            setError(err.message)
        }
        
    }

    return(
        <div className="flex min-h-screen flex-col items-start justify-start ">
            { !completed && (<div className="w-full max-w-md bg-white p-6 rounded-xl">
                <h1 className="font-bold  text-xl mb-4">Baja de Usuario</h1>
                <span className="block w-full h-[2px] bg-sky-950"></span>

                <h3 className="text-sm mb-2 mt-8">
                    Ingrese el legajo del usuario para proceder a la baja
                </h3>

                <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl">
                {/* Input controlado */}
                <Input
                className="lg:mb-4"
                placeholder="Legajo"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                />

                {/* Botón de búsqueda */}
                <Button
                disabled={!value.trim()}
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                Buscar
                </Button>
                </div>
            </div>)}

            

            {/* Resultado simulado */}
            {found && (
                <div className="flex flex-col justify-center items-center border w-full max-w-md bg-white  border-blue-500  p-6 rounded-xl shadow-md ml-6">
                <CardUsuario title={"Desea dar de baja el usuario?"}/>
                <Button
                    variant="destructive"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={handleBaja}
                >
                    Confirmar Baja
                </Button>
                </div>
            )}

            {deleted && (
                <div className="flex flex-col justify-center items-center border w-full max-w-md bg-white  border-green-500  p-6 rounded-xl shadow-md ml-6">
                <CardUsuario title={"Usuario dado de baja exitosamente"}/>
                <Button
                    variant="destructive"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={()=>{setDeleted(false);setValue("")}}
                >
                    OK
                </Button>
                </div>
                
            
            )}

 
            {error !== null && (
                <PopUp title={"Error"} message={error} onClose={()=>setError(null)}/>
            )}
        </div>
    );
}